import { PrismaService } from '@/src/prisma.service';
import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { AccessStatus, OrgRole } from '@prisma/client';
import { JoinOrgDto, ManageOrgUserDto, OrgDto } from './dto/org.dto';

@Injectable()
export class OrgService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Private method to check if the user is the owner of the organization.
	 * Throws a ForbiddenException if the user is not the owner.
	 * @param organizationId The ID of the organization.
	 * @param userId The ID of the user.
	 * @returns The organization ownership record.
	 * @throws ForbiddenException If the user is not the owner.
	 */
	private async checkOwner(organizationId: string, userId: string) {
		const organizationOwner = await this.prisma.organizationUser.findFirst({
			where: { organizationId, userId, role: OrgRole.OWNER }
		});
		if (!organizationOwner) {
			throw new ForbiddenException(
				'Only the organization owner can perform this action.'
			);
		}
		return organizationOwner;
	}

	/**
	 * Private method to check if the user is the owner of the organization.
	 * Throws a ForbiddenException if the user is not the owner.
	 * @param organizationId The ID of the organization.
	 * @param userId The ID of the user.
	 * @returns The organization ownership record.
	 * @throws ForbiddenException If the user is not the owner.
	 */
	private async checkAdmin(organizationId: string, userId: string) {
		const organizationAdmin = await this.prisma.organizationUser.findFirst({
			where: { organizationId, userId, role: OrgRole.ADMIN }
		});
		if (!organizationAdmin) {
			throw new ForbiddenException(
				'Only the organization admin can perform this action.'
			);
		}
		return organizationAdmin;
	}

	/**
	 * Get all active organizations the user is part of.
	 * @param userId The ID of the user.
	 * @returns List of active organizations and their roles.
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
	 * Get all active organizations the user is part of.
	 * @param userId The ID of the user.
	 * @param id The ID of the organization.
	 * @returns List of active organizations and their roles.
	 */
	async getById({ id, userId }: { id: string; userId: string }) {
		// Шукаємо користувача в організації
		const currentUserInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: id }
		});

		// Якщо користувач не є частиною організації, кидаємо помилку
		if (!currentUserInOrg) {
			throw new ForbiddenException('You are not part of this organization');
		}

		// Якщо користувач заблокований в організації, кидаємо помилку
		if (currentUserInOrg.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('Insufficient permissions');
		}

		// Перевірка, чи має користувач роль OWNER або ADMIN
		const isPermitted = ['OWNER', 'ADMIN'].includes(currentUserInOrg.role);

		// Логіка для вибору додаткових полів
		const organizationSelect = {
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
								ProjectUser: {
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
										tasks: true
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
		};

		// Повертаємо організацію та роль користувача
		return this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: id },
			select: {
				organization: {
					select: organizationSelect
				},
				role: true,
				organizationStatus: true
			}
		});
	}

	/**
	 * Get the role of the current user in a specific organization.
	 * @param organizationId The ID of the organization.
	 * @param userId The ID of the user.
	 * @returns The role of the user in the organization.
	 */
	async getOrganizationRole({
		organizationId,
		userId
	}: {
		organizationId: string;
		userId: string;
	}) {
		// Знаходимо користувача в організації
		const currentUserInOrg = await this.prisma.organizationUser.findFirst({
			where: { organizationId, userId },
			select: {
				role: true,
				organizationStatus: true
			}
		});

		// Якщо користувач не знайдений, кидаємо помилку
		if (!currentUserInOrg) {
			throw new ForbiddenException('You are not part of this organization');
		}

		// Якщо статус користувача BANNED, кидаємо помилку
		if (currentUserInOrg.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('Insufficient permissions');
		}

		// Повертаємо роль користувача
		return {
			role: currentUserInOrg.role
		};
	}

	/**
	 * Get all active organization user in current organization.
	 * @param userId The ID of the user.
	 * @param id The ID of the organization.
	 * @returns List of active organization user.
	 */
	async getUsers({
		id,
		userId,
		projectId,
		hide
	}: {
		id: string;
		userId: string;
		projectId?: string;
		hide?: boolean;
	}) {
		// Шукаємо користувача в організації
		const currentUserInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: id }
		});

		// Якщо користувач не є частиною організації, кидаємо помилку
		if (!currentUserInOrg) {
			throw new ForbiddenException('You are not part of this organization');
		}

		// Якщо користувач заблокований в організації, кидаємо помилку
		if (currentUserInOrg.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('Insufficient permissions');
		}

		// Перевірка, чи має користувач роль OWNER або ADMIN
		const isPermitted = ['OWNER', 'ADMIN'].includes(currentUserInOrg.role);

		if (!isPermitted) {
			throw new ForbiddenException('You do not have permission on such action');
		}

		// Повертаємо організацію та користувачів
		return this.prisma.organizationUser.findMany({
			where: {
				organizationId: id,
				// Виключаємо користувачів зі статусом 'BANNED'
				organizationStatus: { not: 'BANNED' },
				// Виключаємо ролі OWNER та ADMIN
				role: { notIn: ['OWNER', 'ADMIN'] },
				...(projectId && {
					user: {
						ProjectUser: {
							...(hide
								? {
										none: {
											projectId // Виключаємо користувачів, пов'язаних із проектом
										}
									}
								: {
										some: {
											projectId // Виключаємо користувачів, пов'язаних із проектом
										}
									})
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
							ProjectUser: {
								where: {
									projectId
								},
								select: {
									projectStatus: true
								}
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
	 * Create a new organization. Only the user can create an organization with a unique title.
	 * @param dto The organization data transfer object (DTO) containing organization details.
	 * @param userId The ID of the current user who is creating the organization.
	 * @returns The created organization.
	 * @throws ConflictException If an organization with the same title already exists.
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
	 * Update organization details. Only the owner of the organization can perform updates.
	 * @param id The ID of the organization to update.
	 * @param dto The updated organization details.
	 * @param userId The ID of the current user making the update.
	 * @returns The updated organization.
	 * @throws ForbiddenException If the user is not the owner of the organization.
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
		const organizationOwner = await this.checkOwner(id, userId);

		if (!organizationOwner) {
			throw new ForbiddenException(
				'Only the owner can update the organization.'
			);
		}

		// Логіка для вибору додаткових полів
		const organizationSelect = {
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
							ProjectUser: {
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
									tasks: true
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
		};

		await this.prisma.organization.update({
			where: { id },
			data: dto
		});

		// Повертаємо організацію та роль користувача
		return this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: id },
			select: {
				organization: {
					select: organizationSelect
				},
				role: true,
				organizationStatus: true
			}
		});
	}

	/**
	 * Join an organization using a join code and title. Ensures the user is not already a member.
	 * @param dto The DTO containing join code and title.
	 * @param userId The ID of the current user joining the organization.
	 * @returns The created membership for the user in the organization.
	 * @throws NotFoundException If the organization is not found.
	 * @throws ForbiddenException If the user is already a member.
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

		return this.prisma.organizationUser.create({
			data: {
				userId,
				organizationId: organization.id,
				role: OrgRole.VIEWER
			}
		});
	}

	/**
	 * Update the role of a user in an organization. Only the owner can update roles.
	 * @param id The ID of the organization.
	 * @param dto The DTO containing the user's ID and new role.
	 * @param userId The ID of the current user updating the role.
	 * @returns The updated user role.
	 * @throws ForbiddenException If the user is not the owner or if role changes are restricted.
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
		const organizationAdmin = await this.checkAdmin(id, userId);

		if (!organizationAdmin) {
			const organizationOwner = await this.checkOwner(id, userId);

			if (!organizationOwner) {
				throw new ForbiddenException(
					'Only the owner  can update the role in organization.'
				);
			}
			throw new ForbiddenException(
				'Only the admin can update the role in organization.'
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

		// Restrict changing roles of owners or banned users
		if (existingMembership.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('Cannot update role of a banned user.');
		}

		if (updatedRole === OrgRole.OWNER) {
			throw new ForbiddenException(
				'Only the main owner can hold the OWNER role.'
			);
		}

		if (updatedRole === existingMembership.role) {
			throw new ForbiddenException('User already has the requested role.');
		}

		if (existingMembership.role === OrgRole.OWNER) {
			throw new ForbiddenException('Cannot change the role of the owner.');
		}

		return this.prisma.organizationUser.update({
			where: { id: existingMembership.id },
			data: { role: updatedRole }
		});
	}

	/**
	 * Update the status of a user in the organization. Only the owner can update the status.
	 * @param id The ID of the organization.
	 * @param dto The DTO containing the user's ID and new status.
	 * @param userId The ID of the current user updating the status.
	 * @returns The updated status of the user.
	 * @throws ForbiddenException If the user is not a member, or if status update is restricted.
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
		const organizationOwner = await this.checkOwner(id, userId);

		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId: orgUserId, organizationId: id }
		});

		if (!existingMembership) {
			throw new ForbiddenException(
				'User is not a member of this organization.'
			);
		}

		if (organizationOwner.userId === orgUserId) {
			throw new ForbiddenException('Cannot change the owner’s access status.');
		}

		if (existingMembership.organizationStatus === updatedStatus) {
			throw new ForbiddenException(
				`The user already has the status ${updatedStatus}.`
			);
		}

		return this.prisma.organizationUser.update({
			where: { id: existingMembership.id },
			data: {
				...(updatedStatus === AccessStatus.BANNED && { role: OrgRole.VIEWER }),
				organizationStatus: updatedStatus
			}
		});
	}

	/**
	 * Transfer ownership to another user. The new owner must not be banned or already the owner.
	 * @param id The ID of the organization.
	 * @param dto The DTO containing the new owner's user ID.
	 * @param userId The ID of the current owner transferring ownership.
	 * @returns The updated user role.
	 * @throws ForbiddenException If the user is not the owner or the new owner is invalid.
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

		if (existingMembership.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException(
				'User is banned. Cannot transfer ownership to banned users.'
			);
		}

		const organizationOwner = await this.prisma.organizationUser.findFirst({
			where: { organizationId: id, role: OrgRole.OWNER }
		});

		if (userId === orgUserId) {
			throw new ForbiddenException("You can't transfer ownership to yourself.");
		}

		if (organizationOwner && organizationOwner.userId === orgUserId) {
			throw new ForbiddenException('User is already the owner.');
		}

		if (organizationOwner && organizationOwner.userId !== userId) {
			throw new ForbiddenException(
				'You are not the owner of this organization.'
			);
		}

		await this.prisma.organizationUser.update({
			where: { id: organizationOwner.id },
			data: { role: OrgRole.MEMBER }
		});

		return this.prisma.organizationUser.update({
			where: { id: existingMembership.id },
			data: { role: OrgRole.OWNER }
		});
	}

	/**
	 * Exit an organization. A user cannot exit if they are the owner.
	 * @param id The ID of the organization.
	 * @param userId The ID of the user exiting the organization.
	 * @returns A confirmation of the exit.
	 * @throws ForbiddenException If the user is the owner.
	 */
	async exit({ id, userId }: { id: string; userId: string }) {
		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: id }
		});

		if (!existingMembership) {
			throw new ForbiddenException(
				'You are not a member of this organization.'
			);
		}

		if (existingMembership.role === OrgRole.OWNER) {
			throw new ForbiddenException('Owner cannot exit the organization.');
		}

		return this.prisma.organizationUser.delete({
			where: { id: existingMembership.id }
		});
	}

	/**
	 * Delete an organization. Only the owner can delete the organization.
	 * @param id The ID of the organization.
	 * @param userId The ID of the user deleting the organization.
	 * @returns The deleted organization.
	 * @throws ForbiddenException If the user is not the owner.
	 */
	async delete({ id, userId }: { id: string; userId: string }) {
		const organizationOwner = await this.checkOwner(id, userId);

		if (!organizationOwner) {
			throw new ForbiddenException(
				'Only the owner can delete the organization.'
			);
		}

		return this.prisma.organization.delete({
			where: { id }
		});
	}
}
