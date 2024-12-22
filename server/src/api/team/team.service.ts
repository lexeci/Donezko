import { PrismaService } from '@/src/prisma.service';
import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { AccessStatus, OrgRole, Team, TeamRole } from '@prisma/client';
import {
	CreateTeamDto,
	DeleteTeamDto,
	LinkTeamToProjectDto,
	ManageTeamDto,
	UpdateTeamDto
} from './dto/team.dto';

/**
 * TeamService - Service for managing teams within an organization and project.
 *
 * This service provides methods for creating, updating, retrieving, and deleting teams.
 * It also includes methods for managing team members and transferring leadership within teams.
 * The service checks if the current user has the necessary access rights to perform these operations.
 *
 * @module TeamService
 */
@Injectable()
export class TeamService {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Checks if the current user has access to the specified organization and project.
	 *
	 * Ensures the user is part of the organization with an active role and has access to the project.
	 * Throws an exception if the user lacks the required permissions.
	 *
	 * @param organizationId - The organization ID.
	 * @param projectId - The project ID.
	 * @param currentUserId - The ID of the current user.
	 * @throws ForbiddenException if the user lacks access.
	 */
	private async checkAccess({
		organizationId,
		projectId,
		userId
	}: {
		organizationId: string;
		projectId?: string;
		userId: string;
	}): Promise<void> {
		const currentUserInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId: userId, organizationId: organizationId }
		});

		if (!currentUserInOrg) {
			throw new ForbiddenException('You are not part of this organization');
		}

		if (
			([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
				currentUserInOrg.role
			) &&
			currentUserInOrg.organizationStatus === AccessStatus.ACTIVE
		) {
			return;
		}

		if (
			currentUserInOrg.organizationStatus === AccessStatus.BANNED ||
			currentUserInOrg.role === OrgRole.VIEWER
		) {
			throw new ForbiddenException('Insufficient permissions');
		}

		if (projectId) {
			const currentUserInProject = await this.prisma.projectUser.findFirst({
				where: {
					userId,
					projectId,
					projectStatus: AccessStatus.ACTIVE
				}
			});

			if (!currentUserInProject) {
				throw new ForbiddenException('No access to the specified project');
			}
		}
	}

	/**
	 * Verifies if the user is part of the organization and is active.
	 *
	 * @param organizationId - The organization ID.
	 * @param userId - The user ID to check.
	 * @throws NotFoundException if the user is not part of the organization.
	 * @throws ForbiddenException if the user is not active in the organization.
	 */
	private async checkUserInOrganization(
		organizationId: string,
		userId: string
	): Promise<void> {
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: organizationId }
		});

		if (!userInOrg) {
			throw new NotFoundException('User is not part of this organization');
		}

		if (userInOrg.organizationStatus !== AccessStatus.ACTIVE) {
			throw new ForbiddenException('User is not active in this organization');
		}
	}

	/**
	 * Checks if the current user is the leader of the team.
	 *
	 * @param teamId - The team ID.
	 * @param userId - The current user ID.
	 * @returns true if the user is the leader of the team, otherwise false.
	 */
	private async isTeamLeader(teamId: string, userId: string): Promise<boolean> {
		const leader = await this.prisma.teamUser.findFirst({
			where: { teamId, userId, role: TeamRole.LEADER }
		});
		return !!leader;
	}

	/**
	 * Retrieves all teams associated with a specific user.
	 *
	 * This method returns a list of teams for the specified user, regardless of organization or project.
	 * The user must be active in the team.
	 *
	 * @param userId - The current user ID.
	 * @returns The list of teams with their members.
	 */
	async getAllByUserId(userId: string) {
		return this.prisma.team.findMany({
			where: {
				teamUsers: {
					some: {
						userId,
						teamStatus: AccessStatus.ACTIVE // Ensure the user is active in the team
					}
				}
			},
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
		});
	}

	/**
	 * Retrieves all active teams for a project.
	 *
	 * This method returns a list of teams for the specified project, filtered by the user's activity.
	 * The user must have access to the organization and project.
	 *
	 * @param organizationId - The DTO object containing the organization id.
	 * @param userId - The current user ID.
	 * @returns The list of teams with their members.
	 */
	async getAllByOrg({
		organizationId,
		userId
	}: {
		organizationId: string;
		userId: string;
	}) {
		// Перевірка доступу користувача до організації
		await this.checkAccess({ organizationId, userId });

		// Отримуємо роль користувача в організації
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId },
			select: {
				role: true
			}
		});

		// Створення запиту для отримання команд
		let teamsQuery: any;

		if (
			userInOrg?.role === OrgRole.ADMIN ||
			userInOrg?.role === OrgRole.OWNER
		) {
			// Якщо користувач є адміністратором або власником, повертаємо всі команди
			teamsQuery = {
				where: {
					organizationId
				},
				select: {
					id: true,
					title: true,
					description: true,
					projectId: true,
					teamUsers: {
						where: {
							userId // Перевіряємо конкретного користувача в команді
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
			};
		} else if (userInOrg?.role === OrgRole.MEMBER) {
			// Якщо користувач є учасником, повертаємо лише ті команди, в яких він бере участь
			teamsQuery = {
				where: {
					organizationId,
					teamUsers: {
						some: {
							userId,
							OR: [
								{ role: TeamRole.MEMBER, teamStatus: AccessStatus.ACTIVE },
								{ role: TeamRole.LEADER, teamStatus: AccessStatus.ACTIVE }
							]
						}
					}
				},
				select: {
					id: true,
					title: true,
					description: true,
					projectId: true,
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
			};
		} else {
			// Якщо користувач є лише переглядачем, не повертаємо команди
			teamsQuery = {
				where: {
					organizationId,
					teamUsers: {
						none: {
							userId
						}
					}
				},
				select: {
					id: true,
					title: true,
					description: true,
					projectId: true,
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
			};
		}

		// Отримуємо команди з бази даних за допомогою Prisma
		const teams = await this.prisma.team.findMany(teamsQuery);

		// Повертаємо команди разом з ролями і статусами користувача в кожній команді
		return teams;
	}

	/**
	 * Retrieves all active teams for a project.
	 *
	 * This method returns a list of teams for the specified project, filtered by the availability in project.
	 * The user must have access to the organization and project.
	 *
	 * @param organizationId - The DTO object containing the organization id.
	 * @param userId - The current user ID.
	 * @returns The list of teams in project and not in project.
	 */
	async getAllByProject({
		organizationId,
		projectId,
		userId
	}: {
		userId: string;
		projectId: string;
		organizationId: string;
	}) {
		// Перевірка доступу користувача до організації
		await this.checkAccess({ organizationId, userId });

		// Отримуємо роль користувача в організації
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId },
			select: {
				role: true,
				organizationStatus: true
			}
		});

		if (!userInOrg) {
			throw new ForbiddenException('You are not a member of this organization');
		}

		if (
			userInOrg.organizationStatus === AccessStatus.BANNED ||
			userInOrg.role === OrgRole.VIEWER
		) {
			throw new ForbiddenException('You cannot perform such action');
		}

		const regularSelect = {
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
		};

		const teamsInProject = await this.prisma.team.findMany({
			where: {
				organizationId,
				projectTeams: {
					some: {
						projectId
					}
				}
			},
			select: regularSelect
		});

		const teamsNotInProject = await this.prisma.team.findMany({
			where: {
				organizationId,
				projectTeams: {
					none: {
						projectId
					}
				}
			},
			select: regularSelect
		});

		return {
			inProject: teamsInProject,
			notInProject: teamsNotInProject
		};
	}

	/**
	 * Retrieves a specific team by its ID.
	 *
	 * This method returns a team by its ID, including its members and tasks. It checks if the user has access to the organization and project.
	 *
	 * @param dto - The DTO object containing organization and project information.
	 * @param id - The team ID.
	 * @param userId - The current user ID.
	 * @returns The requested team with its members and tasks.
	 * @throws NotFoundException if the team is not found.
	 */
	async getById({
		userId,
		id,
		organizationId
	}: {
		userId: string;
		id: string;
		organizationId: string;
	}) {
		await this.checkAccess({ organizationId, userId });

		const team = await this.prisma.teamUser.findFirst({
			where: { teamId: id, team: { organizationId } },
			select: {
				id: true,
				teamId: true,
				role: true,
				teamStatus: true,
				team: {
					select: {
						id: true,
						title: true,
						description: true,
						createdAt: true,
						updatedAt: true,
						organization: {
							select: {
								id: true,
								title: true,
								description: true,
								organizationUsers: {
									where: {
										userId
									},
									select: {
										role: true
									}
								}
							}
						},
						organizationId: true,
						tasks: true,
						_count: {
							select: {
								teamUsers: true,
								tasks: true
							}
						}
					}
				}
			}
		});

		if (!team) throw new NotFoundException('Team not found');

		return team;
	}

	/**
	 * Creates a new team within the specified project.
	 *
	 * This method creates a new team and assigns the current user as the leader of the team.
	 * It checks if the user has the necessary rights and if a team with the same name already exists.
	 *
	 * @param dto - The DTO object containing information for creating the team.
	 * @param userId - The ID of the current user who is creating the team.
	 * @returns The created team.
	 * @throws ForbiddenException if a team with the same name already exists.
	 */
	async create({
		dto,
		userId
	}: {
		dto: CreateTeamDto;
		userId: string;
	}): Promise<Team> {
		const { organizationId, teamLeaderId, ...restDto } = dto;

		await this.checkAccess({ organizationId, userId });

		const duplicate = await this.prisma.team.findFirst({
			where: {
				organizationId,
				title: dto.title
			}
		});

		if (duplicate) {
			throw new ForbiddenException('A team with this title already exists');
		}

		// Перевірка, чи користувач є власником або адміністратором організації
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		if (
			!(
				userInOrg &&
				([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role)
			)
		) {
			throw new ForbiddenException(
				'Only the admin or owner can create the team in organization'
			);
		}

		return this.prisma.team.create({
			data: {
				...restDto,
				organizationId,
				teamUsers: {
					create: [
						{
							userId: teamLeaderId,
							role: TeamRole.LEADER,
							teamStatus: AccessStatus.ACTIVE
						}
					]
				}
			},
			include: {
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
		});
	}

	/**
	 * Updates a team.
	 *
	 * This method allows the team leader to update the team information.
	 * It checks if the current user is the team leader.
	 *
	 * @param id - The team ID.
	 * @param dto - The DTO object containing the new team information.
	 * @param userId - The current user ID.
	 * @returns The updated team.
	 * @throws ForbiddenException if the user is not the leader of the team.
	 */
	async update({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: UpdateTeamDto;
		userId: string;
	}) {
		const { organizationId } = dto;

		await this.checkAccess({ organizationId, userId });

		// Перевірка, чи користувач є власником або адміністратором організації
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		if (!(await this.isTeamLeader(id, userId))) {
			throw new ForbiddenException('Only the team leader can update this team');
		} else if (
			!(
				userInOrg &&
				([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role)
			)
		) {
			throw new ForbiddenException(
				'Only the admin or owner can link the team to a project'
			);
		}

		await this.prisma.team.update({
			where: { id },
			data: { ...dto }
		});

		const team = await this.prisma.teamUser.findFirst({
			where: { teamId: id, team: { organizationId } },
			select: {
				id: true,
				teamId: true,
				role: true,
				teamStatus: true,
				team: {
					select: {
						id: true,
						title: true,
						description: true,
						createdAt: true,
						updatedAt: true,
						organization: {
							select: {
								id: true,
								title: true,
								description: true,
								organizationUsers: {
									where: {
										userId
									},
									select: {
										role: true
									}
								}
							}
						},
						organizationId: true,
						tasks: true,
						_count: {
							select: {
								teamUsers: true,
								tasks: true
							}
						}
					}
				}
			}
		});

		if (!team) throw new NotFoundException('Team not found');

		return team;
	}

	/**
	 * Links a team to a project.
	 *
	 * This method allows the team leader to link the team to a specific project.
	 * The user must have access to the organization and the project.
	 *
	 * @param id - The team ID.
	 * @param dto - The DTO object containing the project ID to link.
	 * @param userId - The current user ID (leader).
	 * @throws ForbiddenException if the user is not the leader of the team.
	 * @throws NotFoundException if the team or project does not exist.
	 */
	async linkToProject({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: LinkTeamToProjectDto;
		userId: string;
	}) {
		const { organizationId, projectId } = dto;

		// Перевірка доступу до організації та проекту
		await this.checkAccess({ organizationId, projectId, userId });

		// Перевірка, чи користувач є власником або адміністратором організації
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		if (
			!(
				userInOrg &&
				([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role)
			)
		) {
			throw new ForbiddenException(
				'Only the admin or owner can link the team to a project'
			);
		}

		// Перевірка існування проекту в організації
		const project = await this.prisma.project.findFirst({
			where: {
				id: projectId,
				organizationId
			}
		});

		if (!project) {
			throw new NotFoundException('Project not found in this organization');
		}

		// Перевірка, чи вже пов’язана команда з проектом
		const existingLink = await this.prisma.projectTeam.findFirst({
			where: {
				projectId,
				teamId: id
			}
		});

		if (existingLink) {
			throw new ForbiddenException(
				'The team is already linked to this project'
			);
		}

		// Прив'язка команди до проекту
		await this.prisma.projectTeam.create({
			data: {
				projectId,
				teamId: id
			}
		});

		// Повернення оновленої команди
		return this.getAllByProject({
			projectId,
			organizationId,
			userId
		});
	}

	/**
	 * Unlinks a team from a project.
	 *
	 * This method allows the team leader to unlink the team from a specific project.
	 * The user must have access to the organization and the project.
	 *
	 * @param id - The team ID.
	 * @param dto - The DTO object containing the project ID to unlink.
	 * @param userId - The current user ID (leader).
	 * @throws ForbiddenException if the user is not the leader of the team.
	 * @throws NotFoundException if the team or project does not exist or the team is not linked to the project.
	 */
	async unlinkFromProject({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: { projectId: string; organizationId: string };
		userId: string;
	}) {
		const { organizationId, projectId } = dto;

		// Перевірка доступу до організації та проекту
		await this.checkAccess({ organizationId, projectId, userId });

		// Перевірка, чи користувач є власником або адміністратором організації
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		if (
			!(
				userInOrg &&
				([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role)
			)
		) {
			throw new ForbiddenException(
				'Only the admin or owner can unlink the team from a project'
			);
		}

		// Перевірка, чи існує команда
		const team = await this.prisma.team.findUnique({
			where: { id }
		});

		if (!team) {
			throw new NotFoundException('Team not found');
		}

		// Перевірка існування проекту в організації
		const project = await this.prisma.project.findFirst({
			where: {
				id: projectId,
				organizationId
			}
		});

		if (!project) {
			throw new NotFoundException('Project not found in this organization');
		}

		// Перевірка, чи команда вже від'єднана від проекту
		const projectTeam = await this.prisma.projectTeam.findUnique({
			where: {
				projectId_teamId: {
					projectId,
					teamId: id
				}
			}
		});

		if (!projectTeam) {
			throw new NotFoundException('The team is not linked to this project');
		}

		// Відключення команди від проекту
		await this.prisma.projectTeam.delete({
			where: {
				projectId_teamId: {
					projectId,
					teamId: id
				}
			}
		});

		// Повернення оновленої команди
		return this.getAllByProject({
			projectId,
			organizationId,
			userId
		});
	}

	/**
	 * Adds a user to the team.
	 *
	 * This method allows the team leader to add a new user to the team. It checks if the user is part of the organization.
	 *
	 * @param id - The team ID.
	 * @param dto - The DTO object containing the user ID to add.
	 * @param userId - The current user ID (leader).
	 * @returns The updated team with the new member.
	 * @throws ForbiddenException if the current user is not the team leader.
	 */
	async addUserToTeam({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ManageTeamDto;
		userId: string;
	}) {
		const { organizationId, teamUserId } = dto;

		await this.checkAccess({ organizationId, userId });

		if (!(await this.isTeamLeader(id, userId))) {
			throw new ForbiddenException('Only the team leader can add users');
		}

		await this.checkUserInOrganization(organizationId, teamUserId);

		await this.prisma.teamUser.create({
			data: {
				teamId: id,
				userId: teamUserId,
				role: TeamRole.MEMBER,
				teamStatus: AccessStatus.ACTIVE
			}
		});

		return this.getById({ userId, id, organizationId });
	}

	/**
	 * Removes a user from the team.
	 *
	 * This method allows the team leader to remove a user from the team.
	 *
	 * @param id - The team ID.
	 * @param dto - The DTO object containing the user ID to remove.
	 * @param userId - The current user ID (leader).
	 */
	async removeUserFromTeam({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ManageTeamDto;
		userId: string;
	}): Promise<void> {
		const { organizationId, teamUserId } = dto;

		await this.checkAccess({ organizationId, userId });

		if (!(await this.isTeamLeader(id, userId))) {
			throw new ForbiddenException('Only the team leader can remove users');
		}

		await this.prisma.teamUser.delete({
			where: { userId_teamId: { teamId: id, userId: teamUserId } }
		});
	}

	/**
	 * Transfers leadership of the team to another user.
	 *
	 * This method allows the current team leader to transfer leadership to another active user.
	 * It checks if the user is the team leader and if the new leader is active.
	 *
	 * @param id - The team ID.
	 * @param dto - The DTO object containing the new leader's user ID.
	 * @param userId - The current team leader's user ID.
	 * @throws ForbiddenException if the user is not the team leader.
	 * @throws NotFoundException if the new leader is not an active member of the team.
	 */
	async transferLeadership({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ManageTeamDto;
		userId: string;
	}): Promise<void> {
		const { organizationId, teamUserId } = dto;

		await this.checkAccess({ organizationId, userId });

		if (!(await this.isTeamLeader(id, userId))) {
			throw new ForbiddenException(
				'Only the current leader can transfer leadership'
			);
		}

		if (!teamUserId) {
			throw new ForbiddenException('The new leader id must be written');
		}

		const newLeader = await this.prisma.teamUser.findFirst({
			where: { teamId: id, userId: teamUserId, teamStatus: AccessStatus.ACTIVE }
		});

		if (!newLeader) {
			throw new NotFoundException('New leader must be an active team member');
		}

		await this.prisma.$transaction([
			this.prisma.teamUser.update({
				where: { userId_teamId: { teamId: id, userId } },
				data: { role: TeamRole.MEMBER }
			}),
			this.prisma.teamUser.update({
				where: { userId_teamId: { teamId: id, userId: teamUserId } },
				data: { role: TeamRole.LEADER }
			})
		]);
	}

	/**
	 * Allows a user to leave the team.
	 *
	 * This method allows users to leave the team, checking if they are a leader.
	 * If the user is a leader, they must transfer leadership before leaving.
	 *
	 * @param id - The team ID.
	 * @param userId - The user ID.
	 * @throws ForbiddenException if the user is the leader and hasn't transferred leadership.
	 * @throws NotFoundException if the user is not a member of the team.
	 */
	async exitFromTeam({
		id,
		userId
	}: {
		id: string;
		userId: string;
	}): Promise<void> {
		const teamUser = await this.prisma.teamUser.findFirst({
			where: { teamId: id, userId }
		});

		if (!teamUser) {
			throw new NotFoundException('You are not a member of this team');
		}

		if (teamUser.role === TeamRole.LEADER) {
			throw new ForbiddenException(
				'You cannot leave the team as a leader. Please transfer leadership first.'
			);
		}

		await this.prisma.teamUser.delete({
			where: { userId_teamId: { teamId: id, userId } }
		});

		const remainingUsers = await this.prisma.teamUser.count({
			where: { teamId: id }
		});

		if (remainingUsers === 0) {
			await this.prisma.team.delete({
				where: { id }
			});
		}
	}

	/**
	 * Deletes a team.
	 *
	 * This method allows the team leader to delete the team.
	 *
	 * @param id - The team ID.
	 * @param dto - The DTO object containing the organization and project information.
	 * @param userId - The current user ID (leader).
	 */
	async delete({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: DeleteTeamDto;
		userId: string;
	}): Promise<void> {
		const { organizationId } = dto;

		await this.checkAccess({ organizationId, userId });

		if (!(await this.isTeamLeader(id, userId))) {
			throw new ForbiddenException('Only the team leader can delete the team');
		}

		await this.prisma.team.delete({ where: { id } });
	}
}
