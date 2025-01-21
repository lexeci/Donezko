import { PrismaService } from '@/src/prisma.service';
import { RolePermissions } from '../permissions';
import { PermissionType } from '../permissions.types';
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessStatus, OrgRole } from '@prisma/client';

/**
 * The PermissionGuard is a custom NestJS guard that ensures users have the necessary permissions
 * and access to the requested resources (organization, team, or project).
 * It checks the user's role, associated permissions, and membership status in the relevant entities
 * before allowing access to the route.
 *
 * - Verifies user access to the organization, team, and project based on their roles and permissions.
 * - Denies access if the user lacks the required permissions or membership in the specified entities.
 * - Logs detailed information about the user’s request and access validation.
 *
 * The guard can be used in controllers to secure routes by adding permission requirements.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
	private readonly logger = new Logger(PermissionGuard.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly reflector: Reflector
	) {}

	/**
	 * Checks whether the current user has the necessary permissions to access the route.
	 *
	 * This method verifies that the user has the required permissions, checks if the user has access to the specified
	 * organization, team, or project, and denies access if any condition is not met.
	 *
	 * @param context The execution context for the route handler.
	 * @returns A boolean indicating whether the user has the required permissions to access the route.
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { user, params, query, body } = request;

		if (!user) return this.denyAccess('User is not defined in request.'); // Deny if user is not found

		const requiredPermissions =
			this.reflector.get<PermissionType[]>(
				'permissions',
				context.getHandler()
			) || [];

		this.logger.log(
			`Checking user access: {\n user={name:${user.name}, email:${user.email}, id=${user?.id || user?.userId}},\n ${params && `params=${JSON.stringify(params)},\n`} ${query && `query=${JSON.stringify(query)}\n`}},\nRequires permissions: "${JSON.stringify(requiredPermissions)}".`
		);

		const [organizationId, teamId, projectId] = [
			'organizationId',
			'teamId',
			'projectId'
		].map(id => this.getEntityId(id, params, query, body));

		// If no entity ID found (organization, team, or project), only check permissions
		if (!organizationId && !teamId && !projectId)
			return this.checkPermissions({ user, requiredPermissions });

		// Check access for each entity if their ID is provided
		if (organizationId)
			await this.checkAccess('organization', organizationId, user);
		if (teamId) await this.checkAccess('team', teamId, user, organizationId);
		if (projectId)
			await this.checkAccess('project', projectId, user, organizationId);

		// Final permission check after validating entity access
		return this.checkPermissions({ user, organizationId, requiredPermissions });
	}

	/**
	 * Retrieves the entity ID (organization, team, or project) from the request parameters, query, or body.
	 *
	 * @param entityKey The key used to look up the entity ID in the request.
	 * @param params The request parameters.
	 * @param query The request query.
	 * @param body The request body.
	 * @returns The entity ID if found, or throws an error if the entity ID is empty.
	 */
	private getEntityId(
		entityKey: string,
		params: any,
		query: any,
		body: any
	): string | undefined {
		const id = params[entityKey] || query[entityKey] || body[entityKey];
		if (id?.trim() === '')
			this.denyAccess(`${entityKey} cannot be an empty value.`); // Deny if ID is empty
		return id;
	}

	/**
	 * Checks access to the specified entity (organization, team, or project) based on the user's membership and role.
	 *
	 * @param entity The type of entity to check access for (organization, team, or project).
	 * @param entityId The ID of the entity to check.
	 * @param user The current user requesting access.
	 * @param organizationId The ID of the organization the user belongs to (optional).
	 */
	private async checkAccess(
		entity: 'organization' | 'team' | 'project',
		entityId: string,
		user: any,
		organizationId?: string
	): Promise<void> {
		const entityCheckMap = {
			organization: this.checkOrganizationAccess,
			team: this.checkTeamAccess,
			project: this.checkProjectAccess
		};

		// Call the appropriate access check method based on the entity type
		if (entityCheckMap[entity]) {
			await entityCheckMap[entity].call(this, {
				entityId,
				userId: user.id,
				userName: user.name,
				organizationId
			});
		}
	}

	/**
	 * Checks whether the user has access to the specified organization.
	 *
	 * @param entityId The ID of the organization.
	 * @param userId The ID of the user requesting access.
	 * @param userName The name of the user requesting access.
	 */
	private async checkOrganizationAccess({
		entityId: organizationId,
		userId,
		userName
	}: {
		entityId: string;
		userId: string;
		userName: string;
	}): Promise<void> {
		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId },
			include: { organization: { select: { title: true } } }
		});

		// Deny if the user is not a member of the organization
		if (!organizationUser)
			this.denyAccess(
				`User "${userName}" is not a member of organization with id: "${organizationId}".`
			);

		// Deny if the user is banned from the organization
		if (organizationUser.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException(
				`User "${userName}" is banned from organization: "${organizationUser.organization.title}".`
			);
		}

		this.logger.log(
			`User "${userName}" granted access to organization: "${organizationUser.organization.title}".`
		);
	}

	/**
	 * Checks whether the user has access to the specified team.
	 *
	 * @param entityId The ID of the team.
	 * @param userId The ID of the user requesting access.
	 * @param userName The name of the user requesting access.
	 * @param organizationId The ID of the organization the team belongs to.
	 */
	private async checkTeamAccess({
		entityId: teamId,
		userId,
		userName,
		organizationId
	}: {
		entityId: string;
		userId: string;
		userName: string;
		organizationId: string;
	}): Promise<void> {
		const team = await this.prisma.team.findUnique({ where: { id: teamId } });
		if (!team)
			throw new ForbiddenException(`Team with id: "${teamId}" does not exist.`); // Deny if team does not exist

		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: {
				userId,
				organizationId,
				organizationStatus: AccessStatus.ACTIVE
			},
			include: { organization: { select: { title: true } } }
		});

		// Deny if user is not a member of the organization
		if (!organizationUser)
			throw new ForbiddenException(
				`User "${userName}" is not a member of organization: "${organizationUser.organization.title}".`
			);

		// Deny if user is not an admin/owner and is not a team member
		if (
			!([OrgRole.OWNER, OrgRole.ADMIN] as OrgRole[]).includes(
				organizationUser.role
			)
		) {
			const teamUser = await this.prisma.teamUser.findFirst({
				where: { userId, teamId }
			});
			if (!teamUser)
				throw new ForbiddenException(
					`User: "${userName}" is not a member of team: "${team.title}".`
				);

			// Deny if user is banned from the team
			if (teamUser.teamStatus === AccessStatus.BANNED) {
				throw new ForbiddenException(
					`User: "${userName}" is banned from team: "${team.title}".`
				);
			}
		}

		this.logger.log(
			`User: "${userName}" granted access to team: "${team.title}".`
		);
	}

	/**
	 * Checks whether the user has access to the specified project.
	 *
	 * @param entityId The ID of the project.
	 * @param userId The ID of the user requesting access.
	 * @param userName The name of the user requesting access.
	 * @param organizationId The ID of the organization the project belongs to.
	 */
	private async checkProjectAccess({
		entityId: projectId,
		userId,
		userName,
		organizationId
	}: {
		entityId: string;
		userId: string;
		userName: string;
		organizationId: string;
	}): Promise<void> {
		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: {
				userId,
				organizationId,
				organizationStatus: AccessStatus.ACTIVE
			},
			include: { organization: { select: { title: true } } }
		});

		// Deny if user is not a member of the organization
		if (!organizationUser)
			throw new ForbiddenException(
				`User: "${userName}" is not a member of organization: "${organizationId}".`
			);

		// Allow if the user is an owner or admin, even if they are not a project member
		if (
			([OrgRole.OWNER, OrgRole.ADMIN] as OrgRole[]).includes(
				organizationUser.role
			)
		) {
			const project = await this.prisma.project.findUnique({
				where: { id: projectId, organizationId },
				select: { title: true }
			});

			this.logger.log(
				`User: "${userName}" is not a member of project: "${project.title}", but has permission due to role: "${organizationUser.role}".`
			);
		} else {
			const projectUser = await this.prisma.projectUser.findFirst({
				where: { userId, projectId, project: { organizationId } },
				include: { project: { select: { title: true } } }
			});

			// Deny if user is not a member of the project
			if (!projectUser)
				this.denyAccess(
					`User: "${userName}" is not a member of project with id: "${projectId}".`
				);

			// Deny if user is banned from the project
			if (projectUser.projectStatus === AccessStatus.BANNED) {
				throw new ForbiddenException(
					`User: "${userName}" is banned from project: "${projectUser.project.title}".`
				);
			}

			this.logger.log(
				`User: "${userName}" granted access to project: "${projectUser.project.title}".`
			);
		}
	}

	/**
	 * Checks whether the user has the required permissions for the organization.
	 *
	 * @param user The current user.
	 * @param organizationId The ID of the organization the user belongs to.
	 * @param requiredPermissions The list of required permissions for accessing the resource.
	 * @returns A boolean indicating whether the user has all the required permissions.
	 */
	private async checkPermissions({
		user,
		organizationId,
		requiredPermissions
	}: {
		user: any;
		organizationId?: string;
		requiredPermissions: PermissionType[];
	}): Promise<boolean> {
		// Deny if no organization ID is provided
		if (!organizationId)
			return this.denyAccess(
				`User: "${user.name}" cannot be checked due to lack of organization id.`
			);

		const organization = await this.prisma.organization.findUnique({
			where: { id: organizationId },
			select: { title: true }
		});

		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: {
				userId: user.id,
				organizationId
			}
		});

		// Deny if the user is not a member of the organization
		if (!organizationUser)
			throw new ForbiddenException(
				`User: "${user.name}" is not a member of organization: "${organization.title}".`
			);

		const userPermissions = RolePermissions[organizationUser.role] || [];

		// Deny if the user does not have all the required permissions
		if (!this.hasAllPermissions(requiredPermissions, userPermissions)) {
			return this.denyAccess(
				`User: "${user.name}" with role: "${organizationUser.role}" lacks required permissions in organization: "${organization.title}"`
			);
		}

		return true;
	}

	/**
	 * Checks whether the user has all required permissions.
	 *
	 * @param requiredPermissions The list of permissions required for the user.
	 * @param userPermissions The list of permissions the user currently has.
	 * @returns A boolean indicating whether the user has all required permissions.
	 */
	private hasAllPermissions(
		requiredPermissions: PermissionType[],
		userPermissions: PermissionType[]
	): boolean {
		return requiredPermissions.every(permission =>
			userPermissions.includes(permission)
		);
	}

	/**
	 * Denies access by logging a warning and throwing a forbidden exception.
	 *
	 * @param message The message to log and include in the exception.
	 * @returns Always throws a ForbiddenException.
	 */
	private denyAccess(message: string): boolean {
		this.logger.warn(message);
		throw new ForbiddenException(message);
	}
}
