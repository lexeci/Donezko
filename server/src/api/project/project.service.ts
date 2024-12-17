import { PrismaService } from '@/src/prisma.service';
import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { AccessStatus, OrgRole } from '@prisma/client';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
	constructor(private prisma: PrismaService) {}

	// Helper function to check user access
	async checkUserAccess(
		requestUserId: string, // ID користувача, який робить запит
		orgId: string,
		projectId?: string,
		roleCheck: boolean = false,
		retrieveAccessCheck: boolean = false,
		targetUserId?: string // userId того, кого змінюємо (якщо потрібно)
	) {
		// Check if the user is an active member of the organization
		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: {
				userId: requestUserId,
				organizationId: orgId,
				organizationStatus: AccessStatus.ACTIVE
			}
		});
		if (!organizationUser) {
			throw new ForbiddenException(
				'User is not a member of this organization.'
			);
		}

		// If roleCheck is true, ensure the user is an admin or owner
		if (
			roleCheck &&
			organizationUser.role !== OrgRole.ADMIN &&
			organizationUser.role !== OrgRole.OWNER
		) {
			throw new ForbiddenException(
				'Only admins or owners can perform this action.'
			);
		}

		// Якщо параметр retrieveAccessCheck встановлено як true, перевіряємо, що користувач не може змінювати статус власника або адміністратора організації
		if (retrieveAccessCheck && targetUserId) {
			// Отримуємо роль користувача, якого плануємо змінювати (targetUserId)
			const targetOrganizationUser =
				await this.prisma.organizationUser.findFirst({
					where: {
						userId: targetUserId,
						organizationId: orgId
					}
				});

			// Якщо цільовий користувач є власником або адміністратором, або якщо користувач намагається змінити свій власний статус
			if (
				targetOrganizationUser &&
				(targetOrganizationUser.role === OrgRole.OWNER ||
					targetOrganizationUser.role === OrgRole.ADMIN)
			) {
				throw new ForbiddenException(
					'Cannot change the access status of an owner or admin.'
				);
			}
		}

		// Check if the user is a participant in the project if projectId is provided
		if (projectId) {
			const projectUser = await this.prisma.projectUser.findUnique({
				where: { projectId_userId: { projectId, userId: requestUserId } }
			});
			if (!projectUser) {
				throw new ForbiddenException(
					'User is not a participant in this project.'
				);
			}
		}

		// If targetUserId is provided, check if they are part of the project
		if (targetUserId) {
			const projectUser = await this.prisma.projectUser.findUnique({
				where: { projectId_userId: { projectId, userId: targetUserId } }
			});
			if (!projectUser) {
				throw new ForbiddenException(
					'The target user is not a participant in this project.'
				);
			}
		}
	}

	// Get all active projects for a specific user
	async getAll(userId: string) {
		return this.prisma.projectUser.findMany({
			where: { userId, projectStatus: AccessStatus.ACTIVE },
			select: {
				project: true,
				projectStatus: true
			}
		});
	}

	// Get all active projects from a specific organization for a user
	async getAllFromOrg(userId: string, orgId: string) {
		return this.prisma.project.findMany({
			where: {
				organizationId: orgId,
				projectUsers: {
					some: {
						userId,
						projectStatus: AccessStatus.ACTIVE
					}
				}
			},
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
				tasks: true
			}
		});
	}

	// Create a new project
	async create(dto: ProjectDto, userId: string) {
		// Check if project already exists in the organization
		const existingProject = await this.prisma.project.findFirst({
			where: {
				title: dto.title,
				organizationId: dto.organizationId
			}
		});
		if (existingProject) {
			throw new ForbiddenException(
				`Project "${dto.title}" already exists in this organization.`
			);
		}

		// Check user access to the organization (Admin or Owner role)
		await this.checkUserAccess(userId, dto.organizationId, undefined, true);

		// Create the project
		return this.prisma.project.create({
			data: {
				...dto,
				projectUsers: {
					create: [
						{
							projectStatus: AccessStatus.ACTIVE,
							user: { connect: { id: userId } }
						}
					]
				}
			}
		});
	}

	// Add a user to a project
	async addUser(projectId: string, userId: string, targetUserId: string) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId }
		});
		if (!project) throw new NotFoundException('Project not found.');

		// Check user access to the project
		await this.checkUserAccess(userId, project.organizationId, projectId, true);

		// Check if the user is already part of the project
		const existingUser = await this.prisma.projectUser.findUnique({
			where: { projectId_userId: { projectId, userId: targetUserId } }
		});
		if (existingUser) {
			throw new ForbiddenException('User is already part of this project.');
		}

		// Check if the user is part of the organization
		const userInOrganization = await this.prisma.organizationUser.findFirst({
			where: {
				userId: targetUserId,
				organizationId: project.organizationId,
				organizationStatus: AccessStatus.ACTIVE
			}
		});
		if (!userInOrganization) {
			throw new ForbiddenException('User is not part of this organization.');
		}

		return this.prisma.projectUser.create({
			data: {
				projectId,
				userId: targetUserId,
				projectStatus: AccessStatus.ACTIVE
			}
		});
	}

	// Update user status in a project
	async updateStatus(
		projectId: string,
		userId: string,
		targetUserId: string,
		status: AccessStatus
	) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId }
		});
		if (!project) throw new NotFoundException('Project not found.');

		// Check user access to the organization (Admin or Owner role)
		await this.checkUserAccess(
			userId,
			project.organizationId,
			projectId,
			true,
			true,
			targetUserId
		);

		// Update user status in the project
		return this.prisma.projectUser.update({
			where: {
				projectId_userId: { projectId, userId: targetUserId }
			},
			data: {
				projectStatus: status
			}
		});
	}

	// Update an existing project
	async update(projectId: string, dto: ProjectDto, userId: string) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId },
			include: { organization: true }
		});
		if (!project) throw new NotFoundException('Project not found.');

		// Check user access to the organization (Admin or Owner role)
		await this.checkUserAccess(userId, project.organizationId, projectId, true);

		// Update project
		return this.prisma.project.update({
			where: { id: projectId },
			data: { ...dto }
		});
	}

	// Метод для виходу користувача з проєкту
	async exit(userId: string, projectId: string) {
		// Знайти проєкт
		const project = await this.prisma.project.findUnique({
			where: { id: projectId },
			include: { organization: true }
		});
		if (!project) {
			throw new NotFoundException('Project not found.');
		}

		// Перевірка: якщо користувач є власником або адміністратором організації, не дозволяємо вихід з проєкту
		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: {
				userId,
				organizationId: project.organizationId,
				organizationStatus: AccessStatus.ACTIVE
			}
		});
		if (
			organizationUser &&
			(organizationUser.role === OrgRole.OWNER ||
				organizationUser.role === OrgRole.ADMIN)
		) {
			throw new ForbiddenException(
				'Owners and admins cannot leave the project.'
			);
		}

		// Перевірка: якщо користувач є учасником проєкту
		const projectUser = await this.prisma.projectUser.findUnique({
			where: { projectId_userId: { projectId, userId } }
		});
		if (!projectUser) {
			throw new ForbiddenException('User is not a member of this project.');
		}

		// Перевірка: якщо користувач заблокований, не дозволяємо йому вийти
		if (projectUser.projectStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('Banned users cannot leave the project.');
		}

		// Видалення участі користувача з проєкту
		return this.prisma.projectUser.delete({
			where: { projectId_userId: { projectId, userId } }
		});
	}

	// Delete a project
	async delete(projectId: string, userId: string) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId }
		});
		if (!project) throw new NotFoundException('Project not found.');

		// Check user access to the project (Admin or Owner role)
		await this.checkUserAccess(
			userId,
			project.organizationId,
			projectId,
			true,
			false
		);

		// Delete project
		return this.prisma.project.delete({ where: { id: projectId } });
	}
}
