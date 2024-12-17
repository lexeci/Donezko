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
import { AccessStatus } from '@prisma/client';

@Injectable()
export class PermissionGuard implements CanActivate {
	private readonly logger = new Logger(PermissionGuard.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly reflector: Reflector
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { user, params, query, body } = request;

		this.logger.log(
			`Checking user access: user=${user?.id}, params=${JSON.stringify(params)}, query=${JSON.stringify(query)}`
		);

		if (!user) {
			return this.denyAccess('User is not defined in request.');
		}

		const requiredPermissions =
			this.reflector.get<PermissionType[]>(
				'permissions',
				context.getHandler()
			) || [];

		// Збираємо всі доступні `id` з різних джерел
		const organizationId = this.getEntityId(
			'organizationId',
			params,
			query,
			body
		);
		const teamId = this.getEntityId('teamId', params, query, body);
		const projectId = this.getEntityId('projectId', params, query, body);

		// Перевірка доступу до всіх необхідних ентиті
		if (organizationId) {
			await this.checkAccess(
				'organization',
				organizationId,
				user.id,
				user.name
			);
		}
		if (teamId) {
			await this.checkAccess('team', teamId, user.id, user.name);
		}
		if (projectId) {
			await this.checkAccess('project', projectId, user.id, user.name);
		}

		return this.checkPermissions(user, organizationId, requiredPermissions);
	}

	// Допоміжний метод для отримання `id` з `params`, `query`, або `body`
	private getEntityId(
		entityKey: string,
		params: any,
		query: any,
		body: any
	): string | undefined {
		return params[entityKey] || query[entityKey] || body[entityKey];
	}

	// Метод для перевірки доступу до конкретної ентиті
	private async checkAccess(
		entity: 'organization' | 'team' | 'project',
		entityId: string,
		userId: string,
		userName: string
	): Promise<void> {
		switch (entity) {
			case 'organization':
				await this.checkOrganizationAccess(entityId, userId, userName);
				break;
			case 'team':
				await this.checkTeamAccess(entityId, userId, userName);
				break;
			case 'project':
				await this.checkProjectAccess(entityId, userId, userName);
				break;
		}
	}

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
			`User ${userName} is granted access to organization ${organizationId}.`
		);
	}

	private async checkTeamAccess(
		teamId: string,
		userId: string,
		userName: string
	): Promise<void> {
		const teamUser = await this.prisma.teamUser.findFirst({
			where: { userId, teamId }
		});

		if (!teamUser || teamUser.teamStatus === AccessStatus.BANNED) {
			this.denyAccess(`User ${userName} is banned from team ${teamId}.`);
		}

		if (!teamUser) {
			this.denyAccess(`User ${userName} is not a member of team ${teamId}.`);
		}

		this.logger.log(`User ${userName} is granted access to team ${teamId}.`);
	}

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
				userId: userId,
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
				`User ${userName} is not a member of team ${project.title}.`
			);
		}

		if (projectUser.projectStatus === AccessStatus.BANNED) {
			throw new ForbiddenException(
				`User ${userName} is banned from project ${projectId}.`
			);
		}

		this.logger.log(
			`User ${userName} is granted access to project ${projectId}.`
		);
	}

	private async checkPermissions(
		user: any,
		organizationId: string,
		requiredPermissions: PermissionType[]
	): Promise<boolean> {
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

	private hasAllPermissions(
		requiredPermissions: PermissionType[],
		userPermissions: PermissionType[]
	): boolean {
		return requiredPermissions.every(permission =>
			userPermissions.includes(permission)
		);
	}

	private denyAccess(message: string): boolean {
		this.logger.warn(message);
		throw new ForbiddenException(message);
	}
}
