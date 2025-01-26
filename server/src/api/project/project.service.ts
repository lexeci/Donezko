import { PrismaService } from '@/src/prisma.service';
import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { AccessStatus, OrgRole, ProjectRole } from '@prisma/client';
import {
	ManageProjectUserDto,
	ProjectDto,
	ProjectStatusDto,
	TransferManagerDto
} from './dto/project.dto';

/**
 * Service class for handling project-related operations.
 * Handles project management including creation, updates, user management, and project access control.
 */
@Injectable()
export class ProjectService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Helper function to check the user's access rights for an organization or user.
	 * @param userId - The ID of the user requesting access.
	 * @param orgId - The ID of the organization.
	 * @param projectId - (Optional) The ID of the project.
	 * @param roleCheck - (Optional) Flag to check if the user has a required role.
	 * @throws ForbiddenException if the user does not have sufficient permissions.
	 * @returns Organization User, Project User or all together in one object
	 * @example
	 * const { organizationUser, projectUser } = await this.checkUserInOrganization({
	 *   userId: 'user-id',
	 *   orgId: 'org-id',
	 *   projectId: 'project-id',
	 *   roleCheck: true
	 * });
	 * // This checks if the user is part of the organization and project, and if the user has the necessary permissions.
	 */
	private async checkUserInOrganization({
		roleCheck,
		userId,
		orgId,
		projectId
	}: {
		roleCheck?: boolean;
		userId: string;
		orgId: string;
		projectId?: string;
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

		if (roleCheck && !projectId) {
			if (
				!([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
					organizationUser.role
				)
			) {
				throw new ForbiddenException(
					'Only admins, owners can perform this action.'
				);
			}
		}

		if (projectId) {
			const projectUser = await this.prisma.projectUser.findUnique({
				where: { projectId_userId: { projectId, userId } }
			});

			// Check if the user is part of the project
			if (!projectUser) {
				throw new ForbiddenException(
					'User is not a participant in this project.'
				);
			}

			if (roleCheck) {
				if (
					!([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
						organizationUser.role
					)
				) {
					// Check for project manager role if required
					if (
						!([ProjectRole.MANAGER] as ProjectRole[]).includes(projectUser.role)
					) {
						throw new ForbiddenException(
							'Project manager can perform this action.'
						);
					}
				}
			}
			return { organizationUser, projectUser };
		} else {
			return { organizationUser };
		}
	}

	/**
	 * Helper function to check if required fields are provided in the DTO.
	 * @param dto - The data transfer object containing the fields to validate.
	 * @param fields - List of field names that need to be checked for presence.
	 * @throws ForbiddenException if any of the required fields is missing or empty.
	 * @example
	 * const dto = { title: 'Project Title', organizationId: 'org-id' };
	 * this.validateRequiredFields(dto, ['title', 'organizationId']);
	 * // This will validate if the 'title' and 'organizationId' fields are present and not empty in the dto.
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
	 * @param userId - The ID of the user requesting access.
	 * @param orgId - The ID of the organization.
	 * @param projectId - (Optional) The ID of the project.
	 * @param roleCheck - (Optional) Flag to check if the user has a required role.
	 * @param retrieveAccessCheck - (Optional) Flag to check if the user can change the target user's access.
	 * @param targetUserId - (Optional) The ID of the user whose access is being checked.
	 * @throws ForbiddenException if the user does not have sufficient permissions.
	 * @example
	 * await this.checkUserAccess({
	 *   userId: 'user-id',
	 *   orgId: 'org-id',
	 *   projectId: 'project-id',
	 *   roleCheck: true,
	 *   retrieveAccessCheck: true,
	 *   targetUserId: 'target-user-id'
	 * });
	 * // This checks the user's access to the project and organization, and ensures they can change the access of the target user if needed.
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
		projectId: string;
		roleCheck?: boolean;
		retrieveAccessCheck?: boolean;
		targetUserId?: string;
	}) {
		await this.checkUserInOrganization({
			roleCheck,
			userId,
			orgId,
			projectId
		});

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
	 * @param projectId - The ID of the project to check.
	 * @returns The project if found.
	 * @throws NotFoundException if the project does not exist.
	 * @example
	 * const project = await this.projectExists('project-id');
	 * // If the project exists, it will return the project object.
	 * // If not, it will throw a NotFoundException.
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
	 * @param userId - The ID of the user whose active projects are to be fetched.
	 * @returns A list of active projects associated with the user, including project details such as title, description, and associated teams and tasks.
	 * @example
	 * const activeProjects = await projectService.getAll('user-id');
	 * // activeProjects will contain a list of active projects that the user is part of, along with relevant details.
	 */
	async getAll(userId: string) {
		return this.prisma.project.findMany({
			where: {
				projectUsers: {
					some: {
						userId,
						projectStatus: AccessStatus.ACTIVE // Ensure the user is active in the team
					}
				}
			},
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						projectTeams: true,
						tasks: true
					}
				}
			}
		});
	}

	/**
	 * Fetch a project by its ID and the user's access details.
	 * @param id - The ID of the project to fetch.
	 * @param userId - The ID of the user requesting the project details.
	 * @returns The project details along with associated teams, tasks, and user access information.
	 * @throws ForbiddenException - If the user does not have access to the project.
	 * @throws NotFoundException - If the project does not exist.
	 * @example
	 * const projectDetails = await projectService.getById({
	 *   id: 'project-id',
	 *   userId: 'user-id'
	 * });
	 * // projectDetails will contain project and user-related information if the user has access.
	 */
	async getById({
		id,
		userId,
		organizationId
	}: {
		id: string;
		userId: string;
		organizationId: string;
	}) {
		// Check if the user has access to the organization
		const { organizationUser } = await this.checkUserInOrganization({
			userId,
			orgId: organizationId
		});

		// Check if the user has access to the project
		const projectUser = await this.prisma.projectUser.findUnique({
			where: { projectId_userId: { projectId: id, userId } }
		});

		if (
			!([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
				organizationUser.role
			)
		) {
			if (!projectUser || projectUser.projectStatus !== AccessStatus.ACTIVE) {
				throw new ForbiddenException(
					'User does not have access to this project.'
				);
			}
		}

		// Return project details
		return this.prisma.projectUser.findFirst({
			where: { userId, projectId: id },
			select: {
				id: true,
				userId: true,
				projectId: true,
				projectStatus: true,
				role: true,
				user: {
					select: {
						organizationUsers: {
							where: {
								userId
							},
							select: {
								role: true,
								organizationStatus: true
							}
						}
					}
				},
				project: {
					select: {
						id: true,
						title: true,
						description: true,
						organization: true,
						organizationId: true,
						createdAt: true,
						updatedAt: true,
						projectTeams: {
							select: {
								team: {
									select: {
										id: true,
										title: true,
										description: true,
										teamUsers: {
											where: {
												userId
											},
											select: {
												role: true,
												teamStatus: true
											}
										},
										_count: {
											select: {
												teamUsers: true,
												tasks: true
											}
										}
									}
								}
							}
						},
						tasks: true,
						_count: {
							select: {
								projectTeams: true,
								tasks: true
							}
						}
					}
				}
			}
		});
	}

	/**
	 * Fetch a project's role for a specific user.
	 * @param id - The ID of the project for which the role is being fetched.
	 * @param userId - The ID of the user whose role in the project is to be retrieved.
	 * @returns The role of the user in the specified project.
	 * @throws ForbiddenException - If the user does not have access to the project.
	 * @throws NotFoundException - If the project does not exist or the user is not part of the project.
	 * @example
	 * const role = await projectService.getRole({
	 *   id: 'project-id',
	 *   userId: 'user-id'
	 * });
	 * // role will contain the user's role in the specified project if they have access.
	 */
	async getRole({
		id,
		userId,
		organizationId
	}: {
		id: string;
		userId: string;
		organizationId;
	}) {
		// Check if the user has access to the organization
		const { organizationUser } = await this.checkUserInOrganization({
			userId,
			orgId: organizationId
		});

		// Check if the user has access to the project
		const projectUser = await this.prisma.projectUser.findUnique({
			where: { projectId_userId: { projectId: id, userId } },
			select: {
				role: true,
				projectStatus: true
			}
		});

		if (
			!([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
				organizationUser.role
			)
		) {
			if (!projectUser || projectUser.projectStatus !== AccessStatus.ACTIVE) {
				throw new ForbiddenException(
					'User does not have access to this project.'
				);
			}
		}

		// Small trick if person is admin or owner he will have manager role instead. Just to simplify code
		return !([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
			organizationUser.role
		)
			? projectUser.role
			: ProjectRole.MANAGER;
	}

	/**
	 * Fetch all active projects within an organization for a specific user.
	 * @param userId - The ID of the user whose active projects are to be fetched.
	 * @param organizationId - The ID of the organization containing the projects.
	 * @param projectId - (Optional) The ID of the project to filter the results by, if specified.
	 * @returns A list of active projects within the specified organization, optionally filtered by a specific project ID.
	 * @throws ForbiddenException - If the user does not have access to the organization or the projects.
	 * @example
	 * const activeProjects = await projectService.getAllFromOrg({
	 *   userId: 'user-id',
	 *   organizationId: 'org-id',
	 *   projectId: 'project-id' // Optional filter by project ID
	 * });
	 * // activeProjects will contain a list of active projects for the user within the specified organization.
	 */
	async getAllFromOrg({
		userId,
		organizationId,
		projectId
	}: {
		userId: string;
		organizationId: string;
		projectId: string;
	}) {
		return this.prisma.project.findMany({
			where: {
				organizationId,
				...(projectId && {
					projectTeams: {
						some: {
							projectId: projectId
						}
					}
				})
			},
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
				projectUsers: {
					where: {
						projectId,
						userId,
						projectStatus: AccessStatus.ACTIVE
					},
					select: {
						role: true,
						projectStatus: true
					}
				},
				_count: {
					select: {
						projectUsers: true,
						tasks: true,
						projectTeams: true
					}
				}
			}
		});
	}

	/**
	 * Fetch all project users for a given project.
	 * @param userId - The ID of the user whose project users are to be fetched.
	 * @param id - The project ID to fetch the users from.
	 * @returns A list of users within the specified project, excluding admins and owners (unless the user has admin or owner role).
	 * @throws ForbiddenException - If the user does not have access to the project.
	 * @example
	 * const projectUsers = await projectService.getAllUsers({
	 *   userId: 'user-id',
	 *   id: 'project-id'
	 * });
	 * // projectUsers will contain a list of users, excluding admins, owners, and managers (if not admin/owner).
	 */
	async getAllUsers({ userId, id }: { userId: string; id: string }) {
		const project = await this.projectExists(id);
		await this.checkUserAccess({
			userId,
			orgId: project.organizationId,
			projectId: id,
			roleCheck: true
		});

		const { organizationUser } = await this.checkUserInOrganization({
			userId,
			orgId: project.organizationId
		});

		return this.prisma.projectUser.findMany({
			where: {
				projectId: id,
				user: {
					organizationUsers: {
						some: {
							organizationId: project.organizationId,
							role: { notIn: [OrgRole.OWNER, OrgRole.ADMIN] },
							organizationStatus: AccessStatus.ACTIVE
						}
					}
				},
				...(!([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
					organizationUser.role
				) && {
					NOT: {
						role: ProjectRole.MANAGER
					}
				})
			},
			select: {
				userId: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true
					}
				},
				role: true,
				projectStatus: true
			}
		});
	}

	/**
	 * Create a new project in an organization.
	 * @param dto - The project details to be created, including the title, organization ID, and optional project manager ID.
	 * @param userId - The ID of the user creating the project.
	 * @returns The created project with the associated users.
	 * @throws ForbiddenException - If the project already exists in the organization or if the user does not have access to the organization.
	 * @example
	 * const newProject = await projectService.create({
	 *   dto: {
	 *     title: 'New Project',
	 *     organizationId: 'org-id',
	 *     projectManagerId: 'manager-id'
	 *   },
	 *   userId: 'creator-id'
	 * });
	 * // newProject will contain the details of the newly created project with the associated users.
	 */
	async create({ dto, userId }: { dto: ProjectDto; userId: string }) {
		this.validateRequiredFields(dto, ['title', 'organizationId']); // Ensure title and organizationId are provided

		const { projectManagerId, ...restDto } = dto;
		const { title, organizationId } = restDto;

		if (!projectManagerId) {
			throw new ForbiddenException('Project manager must be provided');
		}

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

		// Getting organization owner to allow him having access to any project which will be created later
		const organizationOwner = await this.prisma.organizationUser.findFirst({
			where: {
				role: OrgRole.OWNER
			},
			select: {
				userId: true
			}
		});

		// Check user access to the organization (Admin or Owner role)
		await this.checkUserInOrganization({
			userId,
			orgId: organizationId,
			roleCheck: true
		});

		// Create the project
		return this.prisma.project.create({
			data: {
				...restDto,
				projectUsers: {
					create: [
						// We add the user if he is not the owner of the organization
						...(userId !== organizationOwner.userId
							? [
									{
										projectStatus: AccessStatus.ACTIVE,
										user: { connect: { id: userId } }
									}
								]
							: []),
						// We always add an organization's owner
						{
							projectStatus: AccessStatus.ACTIVE,
							user: { connect: { id: organizationOwner.userId } }
						},
						// We add a project manager if ProjectManagerid is specified
						...(projectManagerId
							? [
									{
										projectStatus: AccessStatus.ACTIVE,
										user: { connect: { id: projectManagerId } },
										role: ProjectRole.MANAGER
									}
								]
							: [])
					]
				}
			}
		});
	}

	/**
	 * Add a user to an existing project.
	 * @param id - The project ID to which the user will be added.
	 * @param dto - The user details, including the user ID of the participant to be added.
	 * @param userId - The ID of the user performing the addition action.
	 * @returns The updated project user association.
	 * @throws ForbiddenException - If the user is already part of the project or not part of the organization.
	 * @example
	 * const updatedProjectUserAssociation = await projectService.addUser({
	 *   id: 'project-id',
	 *   dto: { projectUserId: 'new-user-id' },
	 *   userId: 'admin-id'
	 * });
	 * // updatedProjectUserAssociation will contain the updated project-user relationship after adding the user.
	 */
	async addUser({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ManageProjectUserDto;
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
	 * Remove a user from an existing project.
	 * @param id - The project ID from which the user will be removed.
	 * @param dto - The user details, including the user ID of the participant to be removed.
	 * @param userId - The ID of the user performing the removal action.
	 * @returns The updated project user association.
	 * @throws ForbiddenException - If the user is not part of the project, not part of the organization, or is a manager without transferring the role first.
	 * @example
	 * const updatedProjectUserAssociation = await projectService.removeUser({
	 *   id: 'project-id',
	 *   dto: { projectUserId: 'user-id' },
	 *   userId: 'admin-id'
	 * });
	 * // updatedProjectUserAssociation will contain the updated project-user relationship after removal.
	 */
	async removeUser({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ManageProjectUserDto;
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

		// Check if the user is not part of the project
		const existingUser = await this.prisma.projectUser.findUnique({
			where: { projectId_userId: { projectId: id, userId: projectUserId } }
		});

		if (!existingUser) {
			throw new ForbiddenException('User is not part of this project.');
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

		if (existingUser.role === ProjectRole.MANAGER) {
			throw new ForbiddenException(
				'You cannot remove the project manager before transferring the managership.'
			);
		}

		return this.prisma.projectUser.delete({
			where: {
				id: existingUser.id,
				projectId: id,
				userId: projectUserId,
				projectStatus: AccessStatus.ACTIVE
			}
		});
	}

	/**
	 * Update an existing project.
	 * @param id - The project ID to be updated.
	 * @param dto - The updated project details, including the title and organization ID.
	 * @param userId - The ID of the user performing the update.
	 * @returns The updated project.
	 * @throws ForbiddenException - If the user does not have permission to update the project.
	 * @example
	 * const updatedProject = await projectService.update({
	 *   id: 'project-id',
	 *   dto: { title: 'New Project Title', organizationId: 'organization-id' },
	 *   userId: 'user-id'
	 * });
	 * // updatedProject will contain the details of the updated project.
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
	 * Update the status of a user in a project.
	 * @param id - The project ID where the user status is to be updated.
	 * @param dto - Contains the updated user status details, including the new status and the user ID whose status is being updated.
	 * @param userId - The ID of the user performing the update.
	 * @returns The updated project user status.
	 * @throws ForbiddenException - If the user does not have permission to update the status of the target user in the project.
	 * @example
	 * const result = await projectService.updateStatus({
	 *   id: 'project-id',
	 *   dto: { projectStatus: 'ACTIVE', projectUserId: 'user-id' },
	 *   userId: 'admin-user-id'
	 * });
	 * // result will contain the updated status of the project user.
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
	 * Transfers the project manager role to another user.
	 * @param id - The project ID where the manager role is being transferred.
	 * @param dto - Contains the ID of the user who will be the new manager.
	 * @param userId - The ID of the user performing the transfer.
	 * @returns A success message indicating the manager role has been transferred.
	 * @throws ForbiddenException - If the user does not have permission to perform this action, if the new manager is not a project participant, or if the user is banned.
	 * @example
	 * const result = await projectService.transferManagerRole({
	 *   id: 'project-id',
	 *   dto: { newManagerId: 'new-manager-id' },
	 *   userId: 'admin-user-id'
	 * });
	 * // result will contain a success message indicating the manager role has been transferred to the new manager.
	 */
	async transferManagerRole({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: TransferManagerDto;
		userId: string;
	}) {
		const { newManagerId } = dto;
		const project = await this.projectExists(id);

		// Check if the user performing the transfer is either an admin or owner
		const { organizationUser } = await this.checkUserInOrganization({
			userId,
			orgId: project.organizationId,
			roleCheck: true
		});

		if (
			!([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
				organizationUser.role
			)
		) {
			throw new ForbiddenException(
				'Only admins or owners can transfer the project manager role.'
			);
		}

		// Check if the new manager is already part of the project
		const existingProjectUser = await this.prisma.projectUser.findUnique({
			where: { projectId_userId: { projectId: id, userId: newManagerId } }
		});
		if (!existingProjectUser) {
			throw new ForbiddenException(
				'The user is not a participant in this project.'
			);
		}

		if (existingProjectUser.projectStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('The user is banned in this project.');
		}

		// Check if the new manager is already part of the project
		const currentManager = await this.prisma.projectUser.findFirst({
			where: { projectId: id, role: ProjectRole.MANAGER }
		});

		if (currentManager.userId === newManagerId) {
			throw new ForbiddenException(
				'You can not transfer managership to the same person.'
			);
		}

		// Update the project user's roles in the project
		await this.prisma.projectUser.update({
			where: {
				projectId_userId: { projectId: id, userId: currentManager.userId }
			},
			data: {
				role: ProjectRole.MEMBER // Change current manager's role to member
			}
		});

		// Assign the manager role to the new user
		return this.prisma.projectUser.update({
			where: {
				projectId_userId: { projectId: id, userId: existingProjectUser.userId }
			},
			data: {
				role: ProjectRole.MANAGER
			}
		});
	}

	/**
	 * Allows a user to exit a project.
	 * @param id - The ID of the project the user is leaving.
	 * @param userId - The ID of the user exiting the project.
	 * @returns A success message indicating the user has exited the project.
	 * @throws ForbiddenException - If the user is an admin/owner, banned from the project, or a manager who hasn't transferred the role.
	 * @example
	 * const result = await projectService.exit({ id: 'project-id', userId: 'user-id' });
	 * // result will contain a success message indicating the user has successfully exited the project.
	 */
	async exit({ id, userId }: { id: string; userId: string }) {
		const project = await this.projectExists(id);

		const { organizationUser, projectUser } =
			await this.checkUserInOrganization({
				orgId: project.organizationId,
				userId,
				roleCheck: false,
				projectId: project.id
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

		if (!projectUser) {
			throw new ForbiddenException('User is not a member of this project.');
		}

		if (projectUser.role === ProjectRole.MANAGER) {
			throw new ForbiddenException(
				'Manager can not leave project before transferring the role'
			);
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
	 * @param id - The ID of the project to be deleted.
	 * @param userId - The ID of the user requesting the deletion of the project.
	 * @returns A success message indicating the project has been deleted.
	 * @throws ForbiddenException - If the user does not have permission to delete the project.
	 * @example
	 * const result = await projectService.delete({ id: 'project-id', userId: 'user-id' });
	 * // result will contain a success message if deletion is successful.
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
