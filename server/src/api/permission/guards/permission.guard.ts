import { RolePermissions } from '@/src/constants/permissions';
import { PrismaService } from '@/src/prisma.service';
import { PermissionType } from '@/src/types/permissions.types';
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
 * PermissionGuard is a custom guard that checks if a user has the required permissions
 * to access a specific route or resource. It checks user roles, organization membership,
 * project participation, and team involvement.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
	private readonly logger = new Logger(PermissionGuard.name);

	// Injecting PrismaService for database interaction and Reflector to read route metadata
	constructor(
		private readonly prisma: PrismaService,
		private readonly reflector: Reflector
	) {}

	/**
	 * Determines whether a user has permission to access the route.
	 * Checks if the user is authorized based on their roles and permissions.
	 *
	 * @param context The execution context for the current request.
	 * @returns A boolean indicating whether access is allowed.
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { user, params, query, body } = request;

		this.logger.log(
			`Checking user access: user=${user?.id}, params=${JSON.stringify(params)}, query=${JSON.stringify(query)}`
		);

		if (!user) {
			return this.denyAccess('User is not defined in request.');
		}

		// Retrieve required permissions from route metadata
		const requiredPermissions =
			this.reflector.get<PermissionType[]>(
				'permissions',
				context.getHandler()
			) || [];

		// Extract entity IDs (organization, team, project) from request parameters, query, or body
		const organizationId = this.getEntityId(
			'organizationId',
			params,
			query,
			body
		);
		const teamId = this.getEntityId('teamId', params, query, body);
		const projectId = this.getEntityId('projectId', params, query, body);

		// Skip entity checks if no entity IDs are provided (e.g., listing all projects)
		if (!organizationId && !teamId && !projectId) {
			return this.checkPermissions(user, null, requiredPermissions);
		}

		// Check access for each entity if IDs are provided
		if (organizationId) {
			await this.checkAccess(
				'organization',
				organizationId,
				projectId,
				user.id,
				user.name
			);
		}
		if (teamId) {
			await this.checkAccess(
				'team',
				teamId,
				organizationId,
				user.id,
				user.name
			);
		}
		if (projectId) {
			await this.checkAccess(
				'project',
				projectId,
				projectId,
				user.id,
				user.name
			);
		}

		// Check if the user has the necessary permissions for the organization
		return this.checkPermissions(user, organizationId, requiredPermissions);
	}

	/**
	 * Helper method to extract an entity ID (organizationId, teamId, projectId)
	 * from the params, query, or body of the request.
	 *
	 * @param entityKey The key of the entity (e.g., 'organizationId').
	 * @param params The parameters from the route.
	 * @param query The query parameters.
	 * @param body The request body.
	 * @returns The entity ID, or undefined if not found.
	 */
	private getEntityId(
		entityKey: string,
		params: any,
		query: any,
		body: any
	): string | undefined {
		const id = params[entityKey] || query[entityKey] || body[entityKey];
		if (id && id.trim() === '') {
			this.denyAccess(`${entityKey} cannot be an empty value.`);
		}
		return id;
	}

	/**
	 * Checks the user's access to the specified entity (organization, team, or project).
	 * Calls respective checks for each type of entity.
	 *
	 * @param entity The entity type ('organization', 'team', 'project').
	 * @param entityId The ID of the entity.
	 * @param projectId The ID of the project related to the entity (if applicable).
	 * @param userId The ID of the user requesting access.
	 * @param userName The name of the user requesting access.
	 */
	private async checkAccess(
		entity: 'organization' | 'team' | 'project',
		entityId: string,
		organizationId: string,
		userId: string,
		userName: string
	): Promise<void> {
		switch (entity) {
			case 'organization':
				await this.checkOrganizationAccess(entityId, userId, userName);
				break;
			case 'team':
				await this.checkTeamAccess(entityId, userId, userName, organizationId);
				break;
			case 'project':
				await this.checkProjectAccess(entityId, userId, userName);
				break;
		}
	}

	/**
	 * Checks if the user has access to the specified organization.
	 * Denies access if the user is not a member or is banned.
	 *
	 * @param organizationId The ID of the organization.
	 * @param userId The ID of the user.
	 * @param userName The name of the user.
	 */
	private async checkOrganizationAccess(
		organizationId: string,
		userId: string,
		userName: string
	): Promise<void> {
		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});
		if (!organizationUser) {
			this.denyAccess(
				`User ${userName} is not a member of organization ${organizationId}.`
			);
		}
		if (organizationUser.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException(
				`User ${userName} is banned from organization ${organizationId}.`
			);
		}
		this.logger.log(
			`User ${userName} granted access to organization ${organizationId}.`
		);
	}

	/**
	 * Checks if the user has access to the specified team within a project.
	 * Denies access if the user is not a member of the team or project, or if banned.
	 *
	 * @param teamId The ID of the team.
	 * @param organizationId The ID of the project.
	 * @param userId The ID of the user.
	 * @param userName The name of the user.
	 */
	private async checkTeamAccess(
		teamId: string,
		userId: string,
		userName: string,
		organizationId: string
	): Promise<void> {
		const team = await this.prisma.team.findUnique({ where: { id: teamId } });
		if (!team) {
			throw new ForbiddenException(`Team ${teamId} does not exist.`);
		}

		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: {
				userId,
				organizationId: organizationId,
				organizationStatus: AccessStatus.ACTIVE
			}
		});
		if (!organizationUser) {
			throw new ForbiddenException(
				`User ${userName} is not a member of organization ${organizationId}.`
			);
		}

		const isPermitted = ([OrgRole.OWNER, OrgRole.ADMIN] as OrgRole[]).includes(
			organizationUser.role
		);

		if (!isPermitted) {
			const teamUser = await this.prisma.teamUser.findFirst({
				where: { userId, teamId }
			});
			if (!teamUser) {
				throw new ForbiddenException(
					`User ${userName} is not a member of team ${teamId}.`
				);
			}
			if (teamUser.teamStatus === AccessStatus.BANNED) {
				throw new ForbiddenException(
					`User ${userName} is banned from team ${teamId}.`
				);
			}
		}

		this.logger.log(`User ${userName} granted access to team ${teamId}`);
	}

	/**
	 * Checks if the user has access to the specified project.
	 * Denies access if the user is not a member or is banned.
	 *
	 * @param projectId The ID of the project.
	 * @param userId The ID of the user.
	 * @param userName The name of the user.
	 */
	private async checkProjectAccess(
		projectId: string,
		userId: string,
		userName: string
	): Promise<void> {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId },
			select: { organizationId: true, title: true }
		});
		if (!project) {
			throw new ForbiddenException(`Project ${projectId} does not exist.`);
		}

		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: {
				userId,
				organizationId: project.organizationId,
				organizationStatus: AccessStatus.ACTIVE
			}
		});
		if (!organizationUser) {
			this.denyAccess(
				`User ${userName} is not a member of organization ${project.organizationId} and cannot access project ${project.title}.`
			);
		}

		const projectUser = await this.prisma.projectUser.findFirst({
			where: { userId, projectId }
		});
		if (!projectUser) {
			this.denyAccess(
				`User ${userName} is not a member of project ${project.title}.`
			);
		}
		if (projectUser.projectStatus === AccessStatus.BANNED) {
			throw new ForbiddenException(
				`User ${userName} is banned from project ${projectId}.`
			);
		}

		this.logger.log(`User ${userName} granted access to project ${projectId}.`);
	}

	/**
	 * Checks if the user has the required permissions for the organization.
	 *
	 * @param user The user object containing user details.
	 * @param organizationId The ID of the organization.
	 * @param requiredPermissions The permissions required for the action.
	 * @returns A boolean indicating whether the user has the required permissions.
	 */
	private async checkPermissions(
		user: any,
		organizationId: string,
		requiredPermissions: PermissionType[]
	): Promise<boolean> {
		if (!organizationId) {
			// If no organizationId is provided, permission check is skipped (e.g., for listing all projects)
			return true;
		}

		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: { userId: user.id, organizationId }
		});
		if (!organizationUser) {
			throw new ForbiddenException(
				`User ${user.name} is not a member of organization ${organizationId}`
			);
		}

		const userPermissions = RolePermissions[organizationUser.role] || [];
		if (!this.hasAllPermissions(requiredPermissions, userPermissions)) {
			return this.denyAccess(
				`User ${user.name} with role ${organizationUser.role} lacks required permissions.`
			);
		}

		return true;
	}

	/**
	 * Checks if the user has all required permissions.
	 *
	 * @param requiredPermissions The permissions needed for access.
	 * @param userPermissions The permissions granted to the user.
	 * @returns A boolean indicating whether the user has all the required permissions.
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
	 * Denies access and throws a ForbiddenException with the provided message.
	 *
	 * @param message The message to include in the ForbiddenException.
	 * @returns Throws an exception and denies access.
	 */
	private denyAccess(message: string): boolean {
		this.logger.warn(message);
		throw new ForbiddenException(message);
	}
}
