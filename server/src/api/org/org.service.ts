import { PrismaService } from '@/src/prisma.service';
import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { AccessStatus, OrgRole } from '@prisma/client';
import { JoinOrgDto, ManageOrgUserDto, OrgDto } from './dto/org.dto';

/**
 * OrgService - Service for managing organization.
 *
 * This service provides methods for creating, updating, retrieving, and deleting organizations.
 * It also includes methods for managing organization members and transferring ownership within them.
 * The service checks if the current user has the necessary access rights to perform these operations.
 *
 * @module OrgService
 */
@Injectable()
export class OrgService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Retrieves the role and permission status of a user within an organization.
	 * Ensures the user is part of the organization, is not banned, and has the necessary permissions (OWNER or ADMIN).
	 * @param id The ID of the organization.
	 * @param userId The ID of the user whose role and permissions are being checked.
	 * @param ignoreBan The ignoreBan used to allow get status and role without throwing errors.
	 * @returns An object containing the user's permission status (isPermitted) and role within the organization.
	 * @throws ForbiddenException If the user is not part of the organization or is banned.
	 * @example
	 * // Example of checking a user's permissions
	 * const { isPermitted, role } = await getOrgRolePermit({
	 *   id: 'org123',
	 *   userId: 'user456'
	 * });
	 * console.log(isPermitted, role); // true if user is OWNER or ADMIN
	 */
	private async getOrgRolePermit({
		id,
		userId,
		ignoreBan = false
	}: {
		id: string;
		userId: string;
		ignoreBan?: boolean;
	}) {
		// Searching for the user in the organization
		const currentUserInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: id }
		});

		// If the user is not part of the organization, throw an error
		if (!currentUserInOrg) {
			throw new ForbiddenException('You are not part of this organization');
		}

		// Check if the user has OWNER or ADMIN role
		const isPermitted = ([OrgRole.OWNER, OrgRole.ADMIN] as OrgRole[]).includes(
			currentUserInOrg.role
		);

		if (ignoreBan !== true) {
			// If the user is banned in the organization, throw an error
			if (currentUserInOrg.organizationStatus === AccessStatus.BANNED) {
				throw new ForbiddenException('Insufficient permissions');
			}
		}

		return {
			isPermitted,
			role: currentUserInOrg.role,
			status: currentUserInOrg.organizationStatus
		};
	}

	/**
	 * Private method to check if the user is the owner of the organization.
	 * Throws a ForbiddenException if the user is not the owner.
	 * @param organizationId The ID of the organization.
	 * @param userId The ID of the user.
	 * @returns The organization ownership record.
	 * @throws ForbiddenException If the user is not the owner.
	 * @example
	 * // Example of checking if a user is the owner of an organization
	 * const organizationOwner = await getOwner('org123', 'user456');
	 * console.log(organizationOwner); // Returns the ownership record if user is the owner
	 */
	private async getOwner(
		organizationId: string,
		userId: string,
		ignoreError: boolean = false
	) {
		const organizationOwner = await this.prisma.organizationUser.findFirst({
			where: { organizationId, userId, role: OrgRole.OWNER }
		});

		if (!ignoreError && !organizationOwner) {
			throw new ForbiddenException(
				'Only the organization owner can perform this action.'
			);
		}
		return organizationOwner;
	}

	/**
	 * Private method to check if the user is an admin of the organization.
	 * Returns the admin record if the user is an admin.
	 * @param organizationId The ID of the organization.
	 * @param userId The ID of the user.
	 * @returns The organization admin record, if the user is an admin.
	 * @throws ForbiddenException If the user is not an admin.
	 * @example
	 * // Example of checking if a user is an admin of an organization
	 * const organizationAdmin = await getAdmin('org123', 'user456');
	 * console.log(organizationAdmin); // Returns the admin record if user is an admin
	 */
	private async getAdmin(organizationId: string, userId: string) {
		return this.prisma.organizationUser.findFirst({
			where: { organizationId, userId, role: OrgRole.ADMIN }
		});
	}

	/**
	 * Retrieves all active organizations that the user is part of.
	 * @param userId The ID of the user whose organizations are to be fetched.
	 * @returns A list of active organizations with their details and the user's role in each.
	 * @example
	 * // Example of getting all active organizations for a user
	 * const organizations = await orgService.getAll('user123');
	 */
	async getAll(userId: string) {
		return this.prisma.organizationUser.findMany({
			where: { userId, organizationStatus: AccessStatus.ACTIVE },
			select: {
				organization: {
					select: {
						id: true,
						title: true,
						description: true,
						joinCode: true,
						_count: {
							select: {
								organizationUsers: true,
								teams: true,
								projects: true
							}
						}
					}
				},
				role: true,
				organizationStatus: true
			}
		});
	}

	/**
	 * Retrieves a specific organization by its ID and the user's role within it.
	 * @param id The ID of the organization to fetch.
	 * @param userId The ID of the user requesting the organization details.
	 * @returns The organization details along with the user's role and associated data (teams, projects, users) based on permissions.
	 * @example
	 * // Example of getting an organization by ID for a user
	 * const organization = await orgService.getById({ id: 'org123', userId: 'user123' });
	 */
	async getById({ id, userId }: { id: string; userId: string }) {
		const { isPermitted } = await this.getOrgRolePermit({ id, userId });

		// Return organization details along with the user's role and associated entities (teams, projects)
		return this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: id },
			select: {
				organization: {
					select: {
						id: true,
						title: true,
						description: true,
						...(isPermitted && { joinCode: true }),
						teams: isPermitted
							? {
									select: {
										id: true,
										title: true,
										description: true,
										createdAt: true,
										updatedAt: true,
										organization: {
											select: {
												title: true
											}
										},
										teamUsers: true,
										_count: {
											select: {
												teamUsers: true,
												tasks: true
											}
										}
									}
								}
							: {
									select: {
										id: true,
										title: true,
										description: true,
										createdAt: true,
										updatedAt: true,
										organization: {
											select: {
												title: true
											}
										},
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
									},
									where: {
										teamUsers: {
											some: {
												userId,
												teamStatus: AccessStatus.ACTIVE
											}
										}
									}
								},
						projects: isPermitted
							? {
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
								}
							: {
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
									},
									where: {
										projectUsers: {
											some: {
												userId,
												projectStatus: AccessStatus.ACTIVE
											}
										}
									}
								},
						...(isPermitted && {
							organizationUsers: {
								where: {
									role: {
										not: OrgRole.OWNER
									}
								},
								select: {
									userId: true,
									organizationStatus: true,
									role: true,
									user: {
										select: {
											name: true,
											email: true,
											projectUser: {
												select: {
													project: {
														select: {
															title: true
														}
													}
												}
											},
											_count: {
												select: {
													tasksAsAssignee: true
												}
											}
										}
									}
								}
							}
						}),
						_count: {
							select: {
								organizationUsers: isPermitted
									? true
									: {
											where: {
												userId,
												organizationStatus: AccessStatus.ACTIVE
											}
										},
								teams: isPermitted
									? true
									: {
											where: {
												teamUsers: {
													some: {
														userId,
														teamStatus: AccessStatus.ACTIVE
													}
												}
											}
										},
								projects: isPermitted
									? true
									: {
											where: {
												projectUsers: {
													some: {
														userId,
														projectStatus: AccessStatus.ACTIVE
													}
												}
											}
										}
							}
						}
					}
				},
				role: true,
				organizationStatus: true
			}
		});
	}

	/**
	 * Retrieves the role of a user within a specific organization.
	 * @param id The ID of the organization.
	 * @param userId The ID of the user whose role is being fetched.
	 * @returns An object containing the user's role in the organization.
	 * @example
	 * // Example of getting a user's role in an organization
	 * const userRole = await orgService.getOrganizationRole({ id: 'org123', userId: 'user123' });
	 */
	async getOrganizationRole({ id, userId }: { id: string; userId: string }) {
		const { role, status } = await this.getOrgRolePermit({
			id,
			userId,
			ignoreBan: true
		});

		// Return the user's role within the organization
		return {
			role,
			status
		};
	}

	/**
	 * Retrieves all active users in the current organization.
	 * @param id The ID of the organization.
	 * @param userId The ID of the current user making the request.
	 * @param projectId Optional ID of the project to filter users by project participation.
	 * @param hideProject Optional boolean to hide users who are associated with the specified project.
	 * @param teamId Optional ID of the team to filter users by team participation.
	 * @param hideTeam Optional boolean to hide users who are associated with a team.
	 * @returns A list of active users within the organization, with their roles and associated project/team information.
	 * @example
	 * // Example of getting users from a specific organization
	 * const users = await orgService.getUsers({
	 *   id: 'org123',
	 *   userId: 'user123',
	 *   projectId: 'proj123',
	 *   hideProject: false,
	 *   teamId: 'team123',
	 *   hideTeam: true
	 * });
	 */
	async getUsers({
		id,
		userId,
		projectId,
		hideProject,
		teamId,
		hideTeam
	}: {
		id: string;
		userId: string;
		projectId?: string;
		hideProject?: boolean;
		teamId?: string;
		hideTeam?: boolean;
	}) {
		const { isPermitted } = await this.getOrgRolePermit({
			id,
			userId
		});

		if (!isPermitted) {
			throw new ForbiddenException('You do not have permission on such action');
		}

		// Return the organization and the list of users
		return this.prisma.organizationUser.findMany({
			where: {
				organizationId: id,
				organizationStatus: { not: AccessStatus.BANNED },
				role: { notIn: [OrgRole.OWNER, OrgRole.ADMIN] },
				...(projectId &&
					hideProject !== undefined && {
						user: {
							projectUser: {
								[hideProject ? 'none' : 'some']: {
									projectId
								}
							}
						}
					}),
				...(hideTeam && {
					user: {
						teamUsers: {
							none: {} // Exclude users assigned to any team
						}
					}
				}),
				...(teamId &&
					!hideTeam && {
						user: {
							teamUsers: {
								some: {
									teamId
								}
							}
						}
					})
			},
			select: {
				userId: true,
				organizationId: true,
				organizationStatus: true,
				role: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						...(projectId && {
							projectUser: {
								where: { projectId },
								select: { projectStatus: true }
							}
						}),
						...(teamId && {
							teamUsers: {
								where: { teamId },
								select: { teamStatus: true }
							}
						})
					}
				},
				organization: {
					select: {
						title: true,
						description: true
					}
				}
			}
		});
	}

	/**
	 * Creates a new organization with a unique title. Only the user can create an organization with a unique title.
	 * @param dto The organization data transfer object (DTO) containing the details for the new organization.
	 * @param userId The ID of the user who is creating the organization.
	 * @returns The created organization, including the owner user.
	 * @throws ConflictException If an organization with the same title already exists.
	 * @example
	 * // Example of creating a new organization
	 * const newOrg = await orgService.create({
	 *   dto: { title: 'New Organization', description: 'Description of new org' },
	 *   userId: 'user123'
	 * });
	 */
	async create({ dto, userId }: { dto: OrgDto; userId: string }) {
		const existingOrganization = await this.prisma.organization.findFirst({
			where: { title: dto.title } // Check if an organization with the same title exists
		});

		if (existingOrganization) {
			throw new ConflictException(
				'An organization with this name already exists.'
			);
		}

		return this.prisma.organization.create({
			data: {
				...dto,
				organizationUsers: {
					create: [
						{
							role: OrgRole.OWNER,
							user: {
								connect: { id: userId }
							}
						}
					]
				}
			}
		});
	}

	/**
	 * Updates the details of an organization. Only the owner of the organization is allowed to perform updates.
	 * @param id The ID of the organization to update.
	 * @param dto The updated organization details, including fields to modify.
	 * @param userId The ID of the user making the update request.
	 * @returns The updated organization, including associated teams, projects, and users.
	 * @throws ForbiddenException If the user is not the owner of the organization.
	 * @example
	 * // Example of updating an organization's details
	 * const updatedOrg = await orgService.update({
	 *   id: 'org123',
	 *   dto: { title: 'Updated Organization Title', description: 'Updated description' },
	 *   userId: 'user123'
	 * });
	 */
	async update({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: Partial<OrgDto>;
		userId: string;
	}) {
		const organizationOwner = await this.getOwner(id, userId);

		if (!organizationOwner) {
			throw new ForbiddenException(
				'Only the owner can update the organization.'
			);
		}

		// Perform the update
		await this.prisma.organization.update({
			where: { id },
			data: dto
		});

		// Return the updated organization and user role
		return this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: id },
			select: {
				organization: {
					select: {
						id: true,
						title: true,
						description: true,
						joinCode: true,
						teams: {
							select: {
								id: true,
								title: true,
								description: true,
								createdAt: true,
								updatedAt: true,
								organization: {
									select: {
										title: true
									}
								},
								_count: {
									select: {
										teamUsers: true,
										tasks: true
									}
								}
							}
						},
						projects: {
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
						},
						organizationUsers: {
							where: {
								role: {
									not: OrgRole.OWNER
								}
							},
							select: {
								userId: true,
								organizationStatus: true,
								role: true,
								user: {
									select: {
										name: true,
										email: true,
										projectUser: {
											select: {
												project: {
													select: {
														title: true
													}
												}
											}
										},
										_count: {
											select: {
												tasksAsAssignee: true
											}
										}
									}
								}
							}
						},
						_count: {
							select: {
								organizationUsers: true,
								teams: true,
								projects: true
							}
						}
					}
				},
				role: true,
				organizationStatus: true
			}
		});
	}

	/**
	 * Allows a user to join an organization using a join code and title. Ensures the user is not already a member of the organization.
	 * @param dto The data transfer object (DTO) containing the join code and title of the organization.
	 * @param userId The ID of the user who is attempting to join the organization.
	 * @returns The created membership for the user in the organization, assigning them the default role of `VIEWER`.
	 * @throws NotFoundException If no organization is found matching the provided join code and title.
	 * @throws ForbiddenException If the user is already a member of the organization.
	 * @example
	 * // Example of a user joining an organization
	 * const membership = await orgService.join({
	 *   dto: { joinCode: '1234', title: 'Tech Group' },
	 *   userId: 'user123'
	 * });
	 */
	async join({ dto, userId }: { dto: Partial<JoinOrgDto>; userId: string }) {
		const { joinCode, title } = dto;
		const organization = await this.prisma.organization.findFirst({
			where: { joinCode, title }
		});

		if (!organization) {
			throw new NotFoundException(
				'Organization not found with the provided join code and title.'
			);
		}

		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: organization.id }
		});

		if (existingMembership) {
			throw new ForbiddenException(
				'User is already a member of this organization.'
			);
		}

		// Create new membership for the user with the default role of VIEWER
		return this.prisma.organizationUser.create({
			data: {
				userId,
				organizationId: organization.id,
				role: OrgRole.VIEWER
			}
		});
	}

	/**
	 * Allows updating the role of a user within an organization. Only the owner or an admin can change user roles.
	 * Restrictions are placed on modifying the role of banned users or owners.
	 * @param id The ID of the organization.
	 * @param dto The data transfer object (DTO) containing the user's ID and the new role to be assigned.
	 * @param userId The ID of the current user attempting to update the role.
	 * @returns The updated user role within the organization.
	 * @throws ForbiddenException If the user is not an owner or admin, if the role change is restricted, or if the user does not exist within the organization.
	 * @example
	 * // Example of updating a user's role in an organization
	 * const updatedMembership = await orgService.updateRole({
	 *   id: 'org123',
	 *   dto: { orgUserId: 'user456', role: OrgRole.TEAM_LEADER },
	 *   userId: 'admin123'
	 * });
	 */
	async updateRole({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: Partial<ManageOrgUserDto>;
		userId: string;
	}) {
		const { orgUserId, role: updatedRole } = dto;
		const organizationAdmin = await this.getAdmin(id, userId);

		// If the user is not an admin, check if they are the owner
		if (!organizationAdmin) {
			await this.getOwner(id, userId); // If the user is not the owner, an error will be thrown in getOwner
		}

		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId: orgUserId, organizationId: id }
		});

		if (!existingMembership) {
			throw new ForbiddenException(
				'User is not a member of this organization.'
			);
		}

		// Restrict role updates for banned users
		if (existingMembership.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('Cannot update role of a banned user.');
		}

		// Prevent promoting users to OWNER role
		if (updatedRole === OrgRole.OWNER) {
			throw new ForbiddenException(
				'Only the main owner can hold the OWNER role.'
			);
		}

		// Prevent updating role if it's the same as the existing one
		if (updatedRole === existingMembership.role) {
			throw new ForbiddenException('User already has the requested role.');
		}

		// Prevent changing the role of the owner
		if (existingMembership.role === OrgRole.OWNER) {
			throw new ForbiddenException('Cannot change the role of the owner.');
		}

		// Update the role
		return this.prisma.organizationUser.update({
			where: { id: existingMembership.id },
			data: { role: updatedRole }
		});
	}

	/**
	 * Allows updating the status of a user within an organization. Only the owner of the organization can perform the update.
	 * Restrictions apply for changing the status of the owner or if the user is not a member.
	 * @param id The ID of the organization.
	 * @param dto The data transfer object (DTO) containing the user's ID and the new status to be applied.
	 * @param userId The ID of the current user attempting to update the status.
	 * @returns The updated user status within the organization.
	 * @throws ForbiddenException If the user is not a member of the organization, if trying to change the owner’s status, or if the status update is redundant.
	 * @example
	 * // Example of updating a user's status in an organization
	 * const updatedMembership = await orgService.updateStatus({
	 *   id: 'org123',
	 *   dto: { orgUserId: 'user456', organizationStatus: AccessStatus.ACTIVE },
	 *   userId: 'owner123'
	 * });
	 */
	async updateStatus({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: Partial<ManageOrgUserDto>;
		userId: string;
	}) {
		const { orgUserId, organizationStatus: updatedStatus } = dto;

		const organizationAdmin = await this.getAdmin(id, userId);
		const organizationOwner = await this.getOwner(id, userId, true); // If the user is not the owner, an error will be thrown in getOwner

		// If the user is not an admin, check if they are the owner
		if (!organizationAdmin && !organizationOwner) {
			throw new ForbiddenException(
				"You don't have permission to update status."
			);
		}

		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId: orgUserId, organizationId: id }
		});

		if (!existingMembership) {
			throw new ForbiddenException(
				'User is not a member of this organization.'
			);
		}

		// Prevent redundant status updates
		if (existingMembership.organizationStatus === updatedStatus) {
			throw new ForbiddenException(
				`The user already has the status ${updatedStatus}.`
			);
		}

		// Update the user's status and optionally reset their role to VIEWER if banned
		return this.prisma.organizationUser.update({
			where: { id: existingMembership.id },
			data: {
				...(updatedStatus === AccessStatus.BANNED && { role: OrgRole.VIEWER }),
				organizationStatus: updatedStatus
			}
		});
	}

	/**
	 * Transfers ownership of the organization to another user. The new owner must be a valid member of the organization, not banned, and not already the owner.
	 * The current owner cannot transfer ownership to themselves.
	 * @param id The ID of the organization.
	 * @param dto The data transfer object (DTO) containing the new owner's user ID.
	 * @param userId The ID of the current owner transferring ownership.
	 * @returns The updated role of the user who is now the owner.
	 * @throws ForbiddenException If the user is not the current owner, if the new owner is banned, or if the transfer is attempted to oneself.
	 * @example
	 * // Example of transferring ownership to another user
	 * const updatedOwnership = await orgService.updateOwner({
	 *   id: 'org123',
	 *   dto: { orgUserId: 'user456' },
	 *   userId: 'owner123'
	 * });
	 */
	async updateOwner({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: Partial<ManageOrgUserDto>;
		userId: string;
	}) {
		const { orgUserId } = dto;

		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId: orgUserId, organizationId: id }
		});

		if (!existingMembership) {
			throw new ForbiddenException(
				'User is not a member of this organization.'
			);
		}

		// Prevent transferring ownership to a banned user
		if (existingMembership.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException(
				'User is banned. Cannot transfer ownership to banned users.'
			);
		}

		const organizationOwner = await this.prisma.organizationUser.findFirst({
			where: { organizationId: id, role: OrgRole.OWNER }
		});

		// Ensure that the current user is the owner and not transferring ownership to themselves
		if (userId === orgUserId) {
			throw new ForbiddenException("You can't transfer ownership to yourself.");
		}

		// Prevent transferring ownership to the existing owner
		if (organizationOwner && organizationOwner.userId === orgUserId) {
			throw new ForbiddenException('User is already the owner.');
		}

		// Ensure that the current user is the owner of the organization
		if (organizationOwner && organizationOwner.userId !== userId) {
			throw new ForbiddenException(
				'You are not the owner of this organization.'
			);
		}

		// Update the current owner's role to MEMBER
		await this.prisma.organizationUser.update({
			where: { id: organizationOwner.id },
			data: { role: OrgRole.MEMBER }
		});

		// Update the new owner's role to OWNER
		return this.prisma.organizationUser.update({
			where: { id: existingMembership.id },
			data: { role: OrgRole.OWNER }
		});
	}

	/**
	 * Allows a user to exit the organization. Owners are not allowed to exit the organization.
	 * @param id The ID of the organization.
	 * @param userId The ID of the user exiting the organization.
	 * @returns A confirmation of the user's exit from the organization.
	 * @throws ForbiddenException If the user is the owner and cannot exit.
	 * @example
	 * // Example of a user exiting the organization
	 * const exitConfirmation = await orgService.exit({
	 *   id: 'org123',
	 *   userId: 'user456'
	 * });
	 */
	async exit({ id, userId }: { id: string; userId: string }) {
		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: id }
		});

		// Check if the user is a member of the organization
		if (!existingMembership) {
			throw new ForbiddenException(
				'You are not a member of this organization.'
			);
		}

		// Owners cannot exit the organization
		if (existingMembership.role === OrgRole.OWNER) {
			throw new ForbiddenException('Owner cannot exit the organization.');
		}

		// Delete the user's membership from the organization
		return this.prisma.organizationUser.delete({
			where: { id: existingMembership.id }
		});
	}

	/**
	 * Deletes an organization. Only the owner can delete the organization.
	 * @param id The ID of the organization to be deleted.
	 * @param userId The ID of the user attempting to delete the organization.
	 * @returns The deleted organization.
	 * @throws ForbiddenException If the user is not the owner of the organization.
	 * @example
	 * // Example of an owner deleting an organization
	 * const deletedOrg = await orgService.delete({
	 *   id: 'org123',
	 *   userId: 'owner456'
	 * });
	 */
	async delete({ id, userId }: { id: string; userId: string }) {
		const organizationOwner = await this.getOwner(id, userId);

		// Ensure the user is the owner before allowing deletion
		if (!organizationOwner) {
			throw new ForbiddenException(
				'Only the owner can delete the organization.'
			);
		}

		// Delete the organization
		return this.prisma.organization.delete({
			where: { id }
		});
	}
}
