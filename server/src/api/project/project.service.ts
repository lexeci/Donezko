import { PrismaService } from '@/src/prisma.service';
import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { AccessStatus, OrgRole } from '@prisma/client';
import {
	AddProjectUserDto,
	ProjectDto,
	ProjectStatusDto
} from './dto/project.dto';

/**
 * Service class for handling project-related operations.
 * Handles project management including creation, updates, user management, and project access control.
 */
@Injectable()
export class ProjectService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Helper function to check if required fields are provided in the DTO.
	 * @param dto The data transfer object containing the fields to validate.
	 * @param fields List of field names that need to be checked for presence.
	 * @throws ForbiddenException if any of the required fields is missing or empty.
	 */
	private validateRequiredFields(dto: any, fields: string[]) {
		for (const field of fields) {
			if (!dto[field] || dto[field].trim().length === 0) {
				throw new ForbiddenException(`Field "${field}" is required.`);
			}
		}
	}

	/**
	 * Helper function to check the user's access rights for an organization, project, or user.
	 * @param userId The ID of the user requesting access.
	 * @param orgId The ID of the organization.
	 * @param projectId (Optional) The ID of the project.
	 * @param roleCheck (Optional) Flag to check if the user has a required role.
	 * @param retrieveAccessCheck (Optional) Flag to check if the user can change the target user's access.
	 * @param targetUserId (Optional) The ID of the user whose access is being checked.
	 * @throws ForbiddenException if the user does not have sufficient permissions.
	 */
	private async checkUserAccess({
		userId,
		orgId,
		projectId,
		roleCheck = false,
		retrieveAccessCheck = false,
		targetUserId
	}: {
		userId: string;
		orgId: string;
		projectId?: string;
		roleCheck?: boolean;
		retrieveAccessCheck?: boolean;
		targetUserId?: string;
	}) {
		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: {
				userId,
				organizationId: orgId,
				organizationStatus: AccessStatus.ACTIVE
			}
		});
		if (!organizationUser) {
			throw new ForbiddenException(
				'User is not a member of this organization.'
			);
		}

		// Check for admin or owner role if required
		if (
			roleCheck &&
			!([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
				organizationUser.role
			)
		) {
			throw new ForbiddenException(
				'Only admins or owners can perform this action.'
			);
		}

		// Check if the target user is an admin or owner, restricting access changes
		if (retrieveAccessCheck && targetUserId) {
			const targetOrganizationUser =
				await this.prisma.organizationUser.findFirst({
					where: {
						userId: targetUserId,
						organizationId: orgId
					}
				});
			if (
				targetOrganizationUser &&
				([OrgRole.OWNER, OrgRole.ADMIN] as OrgRole[]).includes(
					targetOrganizationUser.role
				)
			) {
				throw new ForbiddenException(
					'Cannot change the access status of an owner or admin.'
				);
			}
		}

		// Check if the user is part of the project
		if (projectId) {
			const projectUser = await this.prisma.projectUser.findUnique({
				where: { projectId_userId: { projectId, userId } }
			});
			if (!projectUser) {
				throw new ForbiddenException(
					'User is not a participant in this project.'
				);
			}
		}

		// Check if the target user is part of the project
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

	/**
	 * Helper method to check if a project exists.
	 * @param projectId The ID of the project to check.
	 * @returns The project if found.
	 * @throws NotFoundException if the project does not exist.
	 */
	private async projectExists(projectId: string) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId }
		});
		if (!project) throw new NotFoundException('Project not found.');
		return project;
	}

	/**
	 * Fetch all active projects for a specific user.
	 * @param userId The ID of the user whose active projects are to be fetched.
	 * @returns A list of active projects associated with the user.
	 */
	async getAll(userId: string) {
		return this.prisma.projectUser.findMany({
			where: { userId, projectStatus: AccessStatus.ACTIVE },
			select: { project: true, projectStatus: true }
		});
	}

	/**
	 * Fetch all active projects within an organization for a specific user.
	 * @param userId The ID of the user whose projects are to be fetched.
	 * @param organizationId The ID of the organization.
	 * @returns A list of active projects within the organization for the specified user.
	 */
	async getAllFromOrg({
		userId,
		organizationId
	}: {
		userId: string;
		organizationId: string;
	}) {
		return this.prisma.project.findMany({
			where: {
				organizationId,
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

	/**
	 * Create a new project in an organization.
	 * @param dto The project details to be created.
	 * @param userId The ID of the user creating the project.
	 * @returns The created project.
	 * @throws ForbiddenException if the project already exists in the organization.
	 */
	async create({ dto, userId }: { dto: ProjectDto; userId: string }) {
		this.validateRequiredFields(dto, ['title', 'organizationId']); // Ensure title and organizationId are provided

		const { title, organizationId } = dto;

		// Check if project already exists in the organization
		const existingProject = await this.prisma.project.findFirst({
			where: {
				title,
				organizationId
			}
		});
		if (existingProject) {
			throw new ForbiddenException(
				`Project "${title}" already exists in this organization.`
			);
		}

		// Check user access to the organization (Admin or Owner role)
		await this.checkUserAccess({
			userId,
			orgId: organizationId,
			roleCheck: true
		});

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

	/**
	 * Add a user to an existing project.
	 * @param id The project ID to which the user will be added.
	 * @param dto The user details to be added.
	 * @param userId The ID of the user adding the new participant.
	 * @returns The updated project user association.
	 * @throws ForbiddenException if the user is already part of the project or not part of the organization.
	 */
	async addUser({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: AddProjectUserDto;
		userId: string;
	}) {
		const { projectUserId } = dto;

		const project = await this.projectExists(id);
		await this.checkUserAccess({
			userId,
			orgId: project.organizationId,
			projectId: id,
			roleCheck: true
		});

		// Check if the user is already part of the project
		const existingUser = await this.prisma.projectUser.findUnique({
			where: { projectId_userId: { projectId: id, userId: projectUserId } }
		});
		if (existingUser) {
			throw new ForbiddenException('User is already part of this project.');
		}

		// Check if the user is part of the organization
		const userInOrganization = await this.prisma.organizationUser.findFirst({
			where: {
				userId: projectUserId,
				organizationId: project.organizationId,
				organizationStatus: AccessStatus.ACTIVE
			}
		});
		if (!userInOrganization) {
			throw new ForbiddenException('User is not part of this organization.');
		}

		return this.prisma.projectUser.create({
			data: {
				projectId: id,
				userId: projectUserId,
				projectStatus: AccessStatus.ACTIVE
			}
		});
	}

	/**
	 * Update the status of a user in a project.
	 * @param id The project ID where the user status is to be updated.
	 * @param dto The updated user status details.
	 * @param userId The ID of the user performing the update.
	 * @returns The updated project user status.
	 * @throws ForbiddenException if the user does not have permission to update the status.
	 */
	async updateStatus({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ProjectStatusDto;
		userId: string;
	}) {
		const { projectStatus, projectUserId } = dto;
		const project = await this.projectExists(id);
		await this.checkUserAccess({
			userId,
			orgId: project.organizationId,
			projectId: id,
			roleCheck: true,
			retrieveAccessCheck: true,
			targetUserId: projectUserId
		});

		// Update user status in the project
		return this.prisma.projectUser.update({
			where: {
				projectId_userId: { projectId: id, userId: projectUserId }
			},
			data: {
				projectStatus
			}
		});
	}

	/**
	 * Update an existing project.
	 * @param id The project ID to be updated.
	 * @param dto The updated project details.
	 * @param userId The ID of the user performing the update.
	 * @returns The updated project.
	 * @throws ForbiddenException if the user does not have permission to update the project.
	 */
	async update({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ProjectDto;
		userId: string;
	}) {
		this.validateRequiredFields(dto, ['title', 'organizationId']); // Ensure title and organizationId are provided

		const project = await this.projectExists(id);
		await this.checkUserAccess({
			userId,
			orgId: project.organizationId,
			projectId: id,
			roleCheck: true
		});

		return this.prisma.project.update({
			where: { id },
			data: { ...dto }
		});
	}

	/**
	 * Allows a user to exit a project.
	 * @param id The project ID the user is leaving.
	 * @param userId The ID of the user exiting the project.
	 * @returns A success message indicating the user has exited the project.
	 * @throws ForbiddenException if the user is an admin/owner or banned from the project.
	 */
	async exit({ id, userId }: { id: string; userId: string }) {
		const project = await this.projectExists(id);

		const organizationUser = await this.prisma.organizationUser.findFirst({
			where: {
				userId,
				organizationId: project.organizationId,
				organizationStatus: AccessStatus.ACTIVE
			}
		});
		if (
			organizationUser &&
			([OrgRole.OWNER, OrgRole.ADMIN] as OrgRole[]).includes(
				organizationUser.role
			)
		) {
			throw new ForbiddenException(
				'Owners and admins cannot leave the project.'
			);
		}

		const projectUser = await this.prisma.projectUser.findUnique({
			where: { projectId_userId: { projectId: id, userId } }
		});
		if (!projectUser) {
			throw new ForbiddenException('User is not a member of this project.');
		}

		if (projectUser.projectStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('Banned users cannot leave the project.');
		}

		return this.prisma.projectUser.delete({
			where: { projectId_userId: { projectId: id, userId } }
		});
	}

	/**
	 * Delete an existing project.
	 * @param id The project ID to be deleted.
	 * @param userId The ID of the user requesting project deletion.
	 * @returns A success message indicating the project has been deleted.
	 * @throws ForbiddenException if the user does not have permission to delete the project.
	 */
	async delete({ id, userId }: { id: string; userId: string }) {
		const project = await this.projectExists(id);
		await this.checkUserAccess({
			userId,
			orgId: project.organizationId,
			projectId: id,
			roleCheck: true
		});

		return this.prisma.project.delete({ where: { id } });
	}
}
