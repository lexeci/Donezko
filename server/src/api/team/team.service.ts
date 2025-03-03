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
	 * This method verifies that the user belongs to the specified organization with an active role
	 * and, if a project ID is provided, checks the user's access to that project.
	 * Admins and owners with active roles are granted access without further checks.
	 *
	 * @param organizationId - The ID of the organization to check access for.
	 * @param projectId - (Optional) The ID of the project to check access for.
	 * @param userId - The ID of the current user performing the action.
	 * @returns Void.
	 * @throws ForbiddenException if:
	 * - The user is not part of the organization.
	 * - The user's role is `VIEWER` or their status is `BANNED`.
	 * - The user does not have access to the specified project (if provided).
	 * @example
	 * // Check access for a user in an organization and project
	 * await checkAccess({
	 *   organizationId: "org-id",
	 *   projectId: "proj-id",
	 *   userId: "user-id"
	 * });
	 *
	 * // Throws ForbiddenException if the user lacks the required permissions.
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

		// Grant access to active admins and owners
		if (
			([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
				currentUserInOrg.role
			) &&
			currentUserInOrg.organizationStatus === AccessStatus.ACTIVE
		) {
			return;
		}

		// Deny access for banned users or viewers
		if (
			currentUserInOrg.organizationStatus === AccessStatus.BANNED ||
			currentUserInOrg.role === OrgRole.VIEWER
		) {
			throw new ForbiddenException('Insufficient permissions');
		}

		// Check access to the specified project, if provided
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
	 * Verifies if the specified user is a member of the organization and has an active status.
	 *
	 * This method ensures that the user belongs to the organization with an active role.
	 * It is used to validate user membership and their ability to participate in organization-related activities.
	 *
	 * @param organizationId - The ID of the organization to check membership for.
	 * @param userId - The ID of the user to verify.
	 * @returns Void.
	 * @throws NotFoundException if the user is not found in the organization.
	 * @throws ForbiddenException if the user's status in the organization is not active.
	 * @example
	 * // Verify that a user is active in an organization
	 * await checkUserInOrganization("org-id", "user-id");
	 *
	 * // Throws NotFoundException if the user is not a member of the organization.
	 * // Throws ForbiddenException if the user is not active in the organization.
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
	 * Determines if the specified user is the leader of the given team.
	 *
	 * This method checks whether the user has the role of `LEADER` within the specified team.
	 * It is primarily used to validate permissions for actions that require team leadership.
	 *
	 * @param teamId - The ID of the team to check.
	 * @param userId - The ID of the user to verify.
	 * @returns A promise that resolves to `true` if the user is the leader of the team, otherwise `false`.
	 * @example
	 * // Check if a user is the leader of a team
	 * const isLeader = await isTeamLeader("team-id", "user-id");
	 *
	 * if (isLeader) {
	 *   console.log("User is the team leader.");
	 * } else {
	 *   console.log("User is not the team leader.");
	 * }
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
	 * The user must be an active member of the team to be included in the results.
	 *
	 * @param userId - The ID of the current user whose teams are being retrieved.
	 * @returns A list of teams with their members and associated information, including the number of users and tasks.
	 * @example
	 * getAllByUserId("user-id")
	 * Returns:
	 * [
	 *   {
	 *     id: "team-id",
	 *     title: "Team A",
	 *     description: "Description of Team A",
	 *     createdAt: "2025-01-01T00:00:00Z",
	 *     updatedAt: "2025-01-02T00:00:00Z",
	 *     organization: { title: "Organization A" },
	 *     _count: { teamUsers: 5, tasks: 10 }
	 *   }
	 * ]
	 */
	async getAllByUserId({
		userId,
		organizationId
	}: {
		userId: string;
		organizationId: string;
	}) {
		const currentUserInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId: userId, organizationId: organizationId }
		});

		if (!currentUserInOrg) {
			throw new ForbiddenException('You are not part of this organization');
		}

		const hasAccess = ([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
			currentUserInOrg.role
		);

		return this.prisma.team.findMany({
			where: {
				...(!hasAccess && {
					teamUsers: {
						some: {
							userId,
							teamStatus: AccessStatus.ACTIVE // Ensure the user is active in the team
						}
					}
				}),
				organizationId
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
	 * Retrieves all active teams for a project within an organization.
	 *
	 * This method returns a list of teams for the specified project, filtered by the user's activity and role in the organization.
	 * The user must have access to the organization and project to retrieve the teams.
	 *
	 * @param organizationId - The ID of the organization to filter the teams.
	 * @param userId - The ID of the current user requesting the teams.
	 * @returns A list of teams associated with the organization, including team members, their roles, and the team's task count.
	 * @example
	 * getAllByOrg({
	 *   organizationId: "org-id",
	 *   userId: "user-id"
	 * })
	 * Returns:
	 * [
	 *   {
	 *     id: "team-id",
	 *     title: "Team A",
	 *     description: "Description of Team A",
	 *     projectId: "project-id",
	 *     teamUsers: [
	 *       { role: "LEADER", teamStatus: "ACTIVE" }
	 *     ],
	 *     _count: { teamUsers: 5, tasks: 10 }
	 *   },
	 * ]
	 */
	async getAllByOrg({
		organizationId,
		userId
	}: {
		organizationId: string;
		userId: string;
	}) {
		// Check user access to the organization
		await this.checkAccess({ organizationId, userId });

		// Get user's role in the organization
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId },
			select: {
				role: true
			}
		});

		// Build the query to fetch teams
		let teamsQuery: any;

		if (
			userInOrg?.role === OrgRole.ADMIN ||
			userInOrg?.role === OrgRole.OWNER
		) {
			// If the user is an admin or owner, return all teams
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
							userId // Check if the specific user is in the team
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
			// If the user is a member, return only teams they are part of
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
			// If the user is a viewer, return no teams
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

		// Return the teams along with user roles and statuses in each team
		return this.prisma.team.findMany(teamsQuery);
	}

	/**
	 * Retrieves all active teams for a project.
	 *
	 * This method returns a list of teams for the specified project, including teams that are in the project and those that are not.
	 * The results are filtered based on the user's availability and permissions for the project.
	 * The user must have access to the organization and project to retrieve the teams.
	 *
	 * @param organizationId - The ID of the organization that the teams belong to.
	 * @param projectId - The ID of the project to filter teams by.
	 * @param userId - The ID of the current user requesting the teams.
	 * @returns An object containing two lists: `inProject` (teams associated with the project) and `notInProject` (teams not associated with the project).
	 * @example
	 * getAllByProject({
	 *   organizationId: "org-id",
	 *   projectId: "project-id",
	 *   userId: "user-id"
	 * })
	 * Returns:
	 * {
	 *   inProject: [
	 *     {
	 *       id: "team-id",
	 *       title: "Team A",
	 *       description: "Description of Team A",
	 *       _count: { teamUsers: 5, tasks: 10 },
	 *       teamUsers: [
	 *         { role: "LEADER", teamStatus: "ACTIVE" }
	 *       ]
	 *     }
	 *   ],
	 *   notInProject: [
	 *     {
	 *       id: "team-id-2",
	 *       title: "Team B",
	 *       description: "Description of Team B",
	 *       _count: { teamUsers: 3, tasks: 5 },
	 *       teamUsers: [
	 *         { role: "MEMBER", teamStatus: "ACTIVE" }
	 *       ]
	 *     }
	 *   ]
	 * }
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
		// Check user access to the organization
		await this.checkAccess({ organizationId, userId });

		// Verify user has access to the project
		const projectUser = await this.prisma.projectUser.findUnique({
			where: { projectId_userId: { projectId, userId } }
		});

		// Get user's role in the organization
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
			!([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role)
		) {
			if (!projectUser || projectUser.projectStatus !== AccessStatus.ACTIVE) {
				throw new ForbiddenException(
					'User does not have access to this project.'
				);
			}
		}

		if (
			userInOrg.organizationStatus === AccessStatus.BANNED ||
			userInOrg.role === OrgRole.VIEWER
		) {
			throw new ForbiddenException('You cannot perform such action');
		}

		// Check if the user has the OWNER or ADMIN role or is a project MANAGER
		const isPermitted = ([OrgRole.OWNER, OrgRole.ADMIN] as OrgRole[]).includes(
			userInOrg.role
		);

		const regularSelect = {
			id: true,
			title: true,
			description: true,
			teamUsers: isPermitted
				? true
				: {
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

		// Retrieve teams in the project
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

		// Retrieve teams not in the project
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
	 * This method returns a team by its ID, including its members, tasks, and associated projects.
	 * It checks if the user has access to the organization and project before fetching the data.
	 *
	 * @param dto - The DTO object containing the organization and project information.
	 * @param id - The ID of the team to retrieve.
	 * @param userId - The ID of the current user requesting the team.
	 * @returns The requested team with its members, tasks, and project details.
	 * @throws NotFoundException if the team is not found or the user does not have access.
	 * @example
	 * getById({
	 *   userId: "user-id",
	 *   id: "team-id",
	 *   organizationId: "organization-id"
	 * })
	 * Returns:
	 * {
	 *   id: "team-id",
	 *   title: "Team A",
	 *   description: "Description of Team A",
	 *   organization: {
	 *     id: "org-id",
	 *     title: "Organization A",
	 *     description: "Description of Organization A",
	 *     organizationUsers: [
	 *       { role: "MEMBER" }
	 *     ]
	 *   },
	 *   teamUsers: [
	 *     { id: "user1-id", userId: "user-id", role: "LEADER", teamStatus: "ACTIVE" }
	 *   ],
	 *   projectTeams: [
	 *     {
	 *       project: {
	 *         id: "project-id",
	 *         title: "Project A",
	 *         description: "Description of Project A",
	 *         _count: { projectUsers: 5, tasks: 10 }
	 *       }
	 *     }
	 *   ],
	 *   _count: { teamUsers: 5, tasks: 15 }
	 * }
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
		// Check user access to the organization
		await this.checkAccess({ organizationId, userId });

		// Retrieve the team by ID with related members and project details
		const team = await this.prisma.team.findUnique({
			where: {
				id,
				organizationId
			},
			include: {
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
				teamUsers: {
					select: {
						id: true,
						userId: true,
						role: true,
						teamStatus: true
					}
				},
				projectTeams: {
					include: {
						project: {
							select: {
								id: true,
								title: true,
								description: true,
								_count: {
									select: {
										projectUsers: true,
										tasks: true
									}
								}
							}
						}
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

		// If the team is not found, throw an exception
		if (!team) throw new NotFoundException('Team not found');

		return team;
	}

	/**
	 * Retrieves all users in a team by its ID.
	 *
	 * This method returns a list of users who are part of the specified team. It ensures that the user requesting the data has access to the organization and team. The list of users is filtered based on the requesting user's role and permissions.
	 *
	 * @param id - The ID of the team whose users are to be retrieved.
	 * @param userId - The ID of the current user making the request.
	 * @param organizationId - The ID of the organization to which the team belongs.
	 * @returns A list of users in the team, including their roles and details.
	 * @throws NotFoundException if the team is not found or if there are issues retrieving the team members.
	 * @throws ForbiddenException if the user does not have sufficient permissions to view the team members.
	 * @example
	 * getAllUsers({
	 *   userId: "user-id",
	 *   id: "team-id",
	 *   organizationId: "organization-id"
	 * })
	 * Returns:
	 * [
	 *   {
	 *     user: {
	 *       id: "user-id",
	 *       name: "John Doe",
	 *       email: "john.doe@example.com"
	 *     },
	 *     role: "MEMBER",
	 *     teamStatus: "ACTIVE"
	 *   },
	 *   {
	 *     user: {
	 *       id: "user-id2",
	 *       name: "Jane Doe",
	 *       email: "jane.doe@example.com"
	 *     },
	 *     role: "LEADER",
	 *     teamStatus: "ACTIVE"
	 *   }
	 * ]
	 */
	async getAllUsers({
		userId,
		id,
		organizationId
	}: {
		userId: string;
		id: string;
		organizationId: string;
	}) {
		// Check user access to the organization
		await this.checkAccess({ organizationId, userId });

		// Retrieve the user's role within the organization
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

		// Check if the user has permission to view all users
		const hasPermission = (
			[OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]
		).includes(userInOrg.role);

		// Retrieve the users in the team
		const teamUsers = await this.prisma.teamUser.findMany({
			where: {
				teamId: id,
				...(!hasPermission && { NOT: { teamStatus: AccessStatus.BANNED } }),
				...(!hasPermission && { NOT: { role: TeamRole.LEADER } })
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						...(hasPermission && { email: true })
					}
				}
			},
			orderBy: {
				user: {
					name: 'desc'
				}
			}
		});

		if (!teamUsers) throw new NotFoundException('Team not found');

		return teamUsers;
	}

	/**
	 * Get the role of the current user in a specific team.
	 *
	 * This method retrieves the role of a user within a specific team. It ensures that the user has access to the organization and checks if the user is part of the team.
	 * If the user does not belong to the organization or team, or if the user's access is restricted, an exception is thrown.
	 *
	 * @param id - The ID of the team in which the role is to be retrieved.
	 * @param userId - The ID of the user whose role is being queried.
	 * @param organizationId - The ID of the organization to which the team belongs.
	 * @returns The role of the user in the team.
	 * @throws ForbiddenException if the user is not a member of the organization, the team, or has insufficient permissions.
	 * @example
	 * getTeamRole({
	 *   userId: "user-id",
	 *   id: "team-id",
	 *   organizationId: "organization-id"
	 * })
	 * Returns:
	 * {
	 *   role: "MEMBER"
	 * }
	 */
	async getTeamRole({
		id,
		userId,
		organizationId
	}: {
		id: string;
		userId: string;
		organizationId: string;
	}) {
		// Check user access to the organization
		const currentUserInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId },
			select: {
				role: true,
				organizationStatus: true
			}
		});

		if (!currentUserInOrg) {
			throw new ForbiddenException('You are not a member of this organization');
		}

		if (
			currentUserInOrg.organizationStatus === AccessStatus.BANNED ||
			currentUserInOrg.role === OrgRole.VIEWER
		) {
			throw new ForbiddenException('You cannot perform such action');
		}

		// If user is not an admin or owner, check if they belong to the team
		if (
			!([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(
				currentUserInOrg.role
			)
		) {
			const currentUserInTeam = await this.prisma.teamUser.findFirst({
				where: {
					userId,
					teamId: id
				},
				select: {
					role: true,
					teamStatus: true
				}
			});

			if (!currentUserInTeam) {
				throw new ForbiddenException('You do not belong to this team');
			}

			// If the user's status is BANNED, throw an error
			if (currentUserInTeam.teamStatus === AccessStatus.BANNED) {
				throw new ForbiddenException('Insufficient permissions');
			}

			// Return the user's role in the team
			return {
				role: currentUserInTeam.role
			};
		}
	}

	/**
	 * Creates a new team within the specified organization.
	 *
	 * This method creates a new team, assigns the specified user as the leader of the team,
	 * and ensures that the current user has the necessary rights to perform this action.
	 * It also checks if a team with the same name already exists in the organization.
	 *
	 * @param dto - The DTO object containing the information required to create the team,
	 *              including the organization ID, team title, and team leader ID.
	 * @param userId - The ID of the current user who is creating the team.
	 * @returns The created team object, including its users and task count.
	 * @throws ForbiddenException if the current user does not have the necessary permissions
	 *                            or if a team with the same name already exists.
	 * @example
	 * create({
	 *   dto: {
	 *     organizationId: "org-id",
	 *     title: "New Team",
	 *     teamLeaderId: "leader-id"
	 *   },
	 *   userId: "admin-id"
	 * })
	 * Returns:
	 * {
	 *   id: "team-id",
	 *   title: "New Team",
	 *   organizationId: "org-id",
	 *   teamUsers: [
	 *     { userId: "leader-id", role: "LEADER", teamStatus: "ACTIVE" }
	 *   ],
	 *   _count: { teamUsers: 1, tasks: 0 }
	 * }
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

		// Check if a team with the same title already exists
		const duplicate = await this.prisma.team.findFirst({
			where: {
				organizationId,
				title: dto.title
			}
		});

		if (duplicate) {
			throw new ForbiddenException('A team with this title already exists');
		}

		// Check if the user is an admin or owner of the organization
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

		// Create the new team and assign the leader
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
	 * Updates a team within the specified organization.
	 *
	 * This method allows the team leader to update the team information. It checks whether
	 * the current user is the leader of the team. If the user is not the team leader,
	 * it checks if the user has the necessary permissions (admin or owner of the organization).
	 *
	 * @param id - The ID of the team to be updated.
	 * @param dto - The DTO object containing the new team information, including the updated title, description, etc.
	 * @param userId - The ID of the current user who is updating the team.
	 * @returns The updated team object, including its updated information and associated users and tasks.
	 * @throws ForbiddenException if the user is not the team leader or does not have the necessary permissions to update the team.
	 * @throws NotFoundException if the team is not found.
	 * @example
	 * update({
	 *   id: "team-id",
	 *   dto: {
	 *     organizationId: "org-id",
	 *     title: "Updated Team Name",
	 *     description: "Updated description of the team"
	 *   },
	 *   userId: "leader-id"
	 * })
	 * Returns:
	 * {
	 *   id: "team-id",
	 *   title: "Updated Team Name",
	 *   description: "Updated description of the team",
	 *   teamUsers: [
	 *     { userId: "leader-id", role: "LEADER", teamStatus: "ACTIVE" }
	 *   ],
	 *   _count: { teamUsers: 1, tasks: 0 }
	 * }
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

		// Check if the user is the team leader or has necessary permissions
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		if (!(await this.isTeamLeader(id, userId))) {
			if (
				!(
					userInOrg &&
					([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role)
				)
			) {
				throw new ForbiddenException(
					'Only the admin, owner, or team leader can update this team'
				);
			}
		}

		// Update the team data
		await this.prisma.team.update({
			where: { id },
			data: { ...dto }
		});

		// Retrieve the updated team and its related data
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
	 * Links a team to a specific project within an organization.
	 *
	 * This method allows the team leader to link a team to a project. It ensures that the user
	 * has the necessary permissions to perform the operation, including access to the organization
	 * and project. Additionally, it checks if the team is already linked to the project.
	 *
	 * @param id - The ID of the team to be linked to the project.
	 * @param dto - The DTO object containing the project ID to link the team to.
	 * @param userId - The ID of the current user (team leader) performing the operation.
	 * @returns The updated list of teams linked to the project.
	 * @throws ForbiddenException if the user is not the leader of the team or does not have the required permissions.
	 * @throws NotFoundException if the project or team does not exist or if the project is not found in the organization.
	 * @example
	 * linkToProject({
	 *   id: "team-id",
	 *   dto: {
	 *     organizationId: "org-id",
	 *     projectId: "project-id"
	 *   },
	 *   userId: "leader-id"
	 * })
	 * Returns:
	 * {
	 *   teams: [
	 *     {
	 *       id: "team-id",
	 *       title: "Team Name",
	 *       projectId: "project-id",
	 *       // other team details
	 *     }
	 *   ]
	 * }
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

		// Check access to the organization and project
		await this.checkAccess({ organizationId, projectId, userId });

		// Check if the user has the required permissions
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

		// Check if the project exists within the organization
		const project = await this.prisma.project.findFirst({
			where: {
				id: projectId,
				organizationId
			}
		});

		if (!project) {
			throw new NotFoundException('Project not found in this organization');
		}

		// Check if the team is already linked to the project
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

		// Link the team to the project
		await this.prisma.projectTeam.create({
			data: {
				projectId,
				teamId: id
			}
		});

		// Return the updated list of teams for the project
		return this.getAllByProject({
			projectId,
			organizationId,
			userId
		});
	}

	/**
	 * Unlinks a team from a specific project within an organization.
	 *
	 * This method allows the team leader to unlink the team from a project. It ensures that the user
	 * has the necessary permissions to perform the operation, including access to the organization
	 * and project. It also checks if the team is already linked to the project and performs the unlinking process.
	 *
	 * @param id - The ID of the team to be unlinked from the project.
	 * @param dto - The DTO object containing the project ID to unlink the team from.
	 * @param userId - The ID of the current user (team leader) performing the operation.
	 * @returns The updated list of teams linked to the project.
	 * @throws ForbiddenException if the user is not the leader of the team or does not have the required permissions.
	 * @throws NotFoundException if the project, team, or the link between the team and project does not exist.
	 * @example
	 * unlinkFromProject({
	 *   id: "team-id",
	 *   dto: {
	 *     organizationId: "org-id",
	 *     projectId: "project-id"
	 *   },
	 *   userId: "leader-id"
	 * })
	 * Returns:
	 * {
	 *   teams: [
	 *     {
	 *       id: "team-id",
	 *       title: "Team Name",
	 *       projectId: "project-id",
	 *       // other team details
	 *     }
	 *   ]
	 * }
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

		// Check access to the organization and project
		await this.checkAccess({ organizationId, projectId, userId });

		// Check if the user has the required permissions
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

		// Check if the team exists
		const team = await this.prisma.team.findUnique({
			where: { id }
		});

		if (!team) {
			throw new NotFoundException('Team not found');
		}

		// Check if the project exists within the organization
		const project = await this.prisma.project.findFirst({
			where: {
				id: projectId,
				organizationId
			}
		});

		if (!project) {
			throw new NotFoundException('Project not found in this organization');
		}

		// Check if the team is linked to the project
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

		// Unlink the team from the project
		await this.prisma.projectTeam.delete({
			where: {
				projectId_teamId: {
					projectId,
					teamId: id
				}
			}
		});

		// Return the updated list of teams for the project
		return this.getAllByProject({
			projectId,
			organizationId,
			userId
		});
	}

	/**
	 * Adds a user to a specific team.
	 *
	 * This method allows the team leader to add a new user to the team. It ensures that the user is part of the organization
	 * and checks that the current user has the necessary permissions to perform the operation (admin, owner, or team leader).
	 * The new user is assigned the role of a member within the team.
	 *
	 * @param id - The team ID to which the user will be added.
	 * @param dto - The DTO object containing the user ID to add and the organization ID.
	 * @param userId - The current user ID (team leader) performing the operation.
	 * @returns The updated team with the new member added.
	 * @throws ForbiddenException if the user is not the team leader, admin, or owner of the organization.
	 * @throws NotFoundException if the user is not part of the organization or if the team does not exist.
	 * @example
	 * addUserToTeam({
	 *   id: "team-id",
	 *   dto: {
	 *     organizationId: "org-id",
	 *     teamUserId: "new-user-id"
	 *   },
	 *   userId: "leader-id"
	 * })
	 * Returns:
	 * {
	 *   id: "team-id",
	 *   title: "Team Name",
	 *   teamUsers: [
	 *     {
	 *       userId: "new-user-id",
	 *       role: "MEMBER",
	 *       teamStatus: "ACTIVE"
	 *     }
	 *   ]
	 * }
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

		// Check access to the organization
		await this.checkAccess({ organizationId, userId });

		// Verify if the user is part of the organization
		await this.checkUserInOrganization(organizationId, teamUserId);

		// Check if the user has necessary permissions (admin, owner, or team leader)
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		if (!(await this.isTeamLeader(id, userId))) {
			if (
				!(
					userInOrg &&
					([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role)
				)
			) {
				throw new ForbiddenException(
					'Only the admin, owner, or team leader can update this team'
				);
			}
		}

		// Add the user to the team as a member
		return this.prisma.teamUser.create({
			data: {
				teamId: id,
				userId: teamUserId,
				role: TeamRole.MEMBER,
				teamStatus: AccessStatus.ACTIVE
			}
		});
	}

	/**
	 * Removes a user from a specific team.
	 *
	 * This method allows the team leader, admin, or owner to remove a user from the team.
	 * It ensures that the user performing the operation has the necessary permissions to modify the team.
	 *
	 * @param id - The team ID from which the user will be removed.
	 * @param dto - The DTO object containing the organization ID and the user ID to be removed from the team.
	 * @param userId - The current user ID (team leader, admin, or owner) performing the operation.
	 * @returns A promise that resolves to void upon successful removal of the user.
	 * @throws ForbiddenException if the current user is not the team leader, admin, or owner of the organization.
	 * @throws NotFoundException if the user or team does not exist.
	 * @example
	 * removeUserFromTeam({
	 *   id: "team-id",
	 *   dto: {
	 *     organizationId: "org-id",
	 *     teamUserId: "user-to-remove-id"
	 *   },
	 *   userId: "leader-id"
	 * })
	 * Resolves:
	 * undefined
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

		// Check access to the organization
		await this.checkAccess({ organizationId, userId });

		// Verify if the user has necessary permissions (team leader, admin, or owner)
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		if (!(await this.isTeamLeader(id, userId))) {
			if (
				!(
					userInOrg &&
					([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role)
				)
			) {
				throw new ForbiddenException(
					'Only the admin, owner, or team leader can update this team'
				);
			}
		}

		// Remove the user from the team
		await this.prisma.teamUser.delete({
			where: { userId_teamId: { teamId: id, userId: teamUserId } }
		});
	}

	/**
	 * Transfers leadership of a team to another user.
	 *
	 * This method allows the current team leader, admin, or owner to transfer leadership to another active team member.
	 * It validates whether the current user has the necessary permissions and ensures the new leader is an active team member.
	 *
	 * @param id - The team ID where the leadership transfer is to occur.
	 * @param dto - The DTO object containing the organization ID and the new leader's user ID.
	 * @param userId - The current user ID of the team leader, admin, or owner performing the transfer.
	 * @returns A promise that resolves to `void` upon successful transfer of leadership.
	 * @throws ForbiddenException if:
	 * - The current user is neither a team leader nor an admin/owner.
	 * - The `teamUserId` (new leader's ID) is not provided.
	 * - The new leader is already the current team leader.
	 * @throws NotFoundException if:
	 * - The new leader is not found as an active member of the team.
	 * @example
	 * transferLeadership({
	 *   id: "team-id",
	 *   dto: {
	 *     organizationId: "org-id",
	 *     teamUserId: "new-leader-id"
	 *   },
	 *   userId: "current-leader-id"
	 * })
	 * Resolves:
	 * undefined
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

		// Check if the user has access to the organization
		await this.checkAccess({ organizationId, userId });

		// Verify if the user is an admin or owner in the organization
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		const hasPermission =
			userInOrg &&
			([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role);

		// Check if the current user is the team leader or has permission
		if (!(await this.isTeamLeader(id, userId))) {
			if (!hasPermission) {
				throw new ForbiddenException(
					'Only the admin, owner, or team leader can update this team'
				);
			}
		}

		// Validate if the new leader ID is provided
		if (!teamUserId) {
			throw new ForbiddenException('The new leader ID must be specified');
		}

		// Check if the new leader is an active member of the team
		const newLeader = await this.prisma.teamUser.findFirst({
			where: { teamId: id, userId: teamUserId, teamStatus: AccessStatus.ACTIVE }
		});

		if (!newLeader) {
			throw new NotFoundException('New leader must be an active team member');
		}

		// Ensure the new leader is not already the current team leader
		if (newLeader.role === TeamRole.LEADER) {
			throw new ForbiddenException(
				'The specified user is already the team leader'
			);
		}

		// Execute the leadership transfer
		if (hasPermission) {
			const oldLeader = await this.prisma.teamUser.findFirst({
				where: {
					teamId: id,
					teamStatus: AccessStatus.ACTIVE,
					role: TeamRole.LEADER
				}
			});

			if (oldLeader) {
				await this.prisma.$transaction([
					this.prisma.teamUser.update({
						where: { userId_teamId: { teamId: id, userId: oldLeader.userId } },
						data: { role: TeamRole.MEMBER }
					}),
					this.prisma.teamUser.update({
						where: { userId_teamId: { teamId: id, userId: teamUserId } },
						data: { role: TeamRole.LEADER }
					})
				]);
			} else {
				await this.prisma.teamUser.update({
					where: { userId_teamId: { teamId: id, userId: teamUserId } },
					data: { role: TeamRole.LEADER }
				});
			}
		} else {
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
	}

	/**
	 * Updates the status of a team member.
	 *
	 * This method allows the team leader, admin, or owner to update the status of a team member (e.g., active, inactive).
	 * It validates the current user's permissions and ensures that the target user is part of the team.
	 *
	 * @param id - The team ID where the status update will be applied.
	 * @param dto - The DTO object containing the organization ID, target user ID, and the new status.
	 * @param userId - The ID of the current user (team leader, admin, or owner) performing the action.
	 * @returns The updated team member record with the new status.
	 * @throws ForbiddenException if:
	 * - The current user is neither a team leader nor an admin/owner of the organization.
	 * @throws NotFoundException if the specified team member or team does not exist.
	 * @example
	 * updateStatus({
	 *   id: "team-id",
	 *   dto: {
	 *     organizationId: "org-id",
	 *     teamUserId: "target-user-id",
	 *     teamStatus: AccessStatus.INACTIVE
	 *   },
	 *   userId: "current-user-id"
	 * })
	 * Resolves:
	 * {
	 *   userId: "target-user-id",
	 *   teamId: "team-id",
	 *   teamStatus: AccessStatus.INACTIVE,
	 *   ...
	 * }
	 */
	async updateStatus({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ManageTeamDto;
		userId: string;
	}) {
		const { organizationId, teamUserId, teamStatus } = dto;

		// Validate user's access to the organization
		await this.checkAccess({ organizationId, userId });

		// Check if the user is an admin or owner in the organization
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		// Ensure the user has sufficient permissions (team leader, admin, or owner)
		if (!(await this.isTeamLeader(id, userId))) {
			if (
				!(
					userInOrg &&
					([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role)
				)
			) {
				throw new ForbiddenException(
					'Only the admin, owner, or team leader can update this team'
				);
			}
		}

		// Update the team member's status
		return this.prisma.teamUser.update({
			where: {
				userId_teamId: { teamId: id, userId: teamUserId }
			},
			data: {
				teamStatus
			}
		});
	}

	/**
	 * Allows a user to leave a team.
	 *
	 * This method enables a user to exit from a team. Before leaving, the method checks if the user is the team leader.
	 * If the user holds the leader role, they must transfer leadership to another member before exiting.
	 * If the team becomes empty after the user leaves, the team is automatically deleted.
	 *
	 * @param id - The ID of the team the user wants to leave.
	 * @param userId - The ID of the user attempting to leave the team.
	 * @returns Void.
	 * @throws ForbiddenException if the user is the team leader and has not transferred leadership.
	 * @throws NotFoundException if the user is not a member of the specified team.
	 * @example
	 * await exitFromTeam({ id: "team-id", userId: "user-id" });
	 *
	 * // User successfully exits from the team if not a leader.
	 * // If the team becomes empty, it is deleted.
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

		// Check if the user is a member of the team
		if (!teamUser) {
			throw new NotFoundException('You are not a member of this team');
		}

		// Prevent team leaders from leaving without transferring leadership
		if (teamUser.role === TeamRole.LEADER) {
			throw new ForbiddenException(
				'You cannot leave the team as a leader. Please transfer leadership first.'
			);
		}

		// Remove the user from the team
		await this.prisma.teamUser.delete({
			where: { userId_teamId: { teamId: id, userId } }
		});

		// Check if the team has any remaining users
		const remainingUsers = await this.prisma.teamUser.count({
			where: { teamId: id }
		});

		// If no users remain, delete the team
		if (remainingUsers === 0) {
			await this.prisma.team.delete({
				where: { id }
			});
		}
	}

	/**
	 * Deletes a team.
	 *
	 * This method allows a team leader or authorized user (admin or owner) to delete a team.
	 * It checks the user's permissions before proceeding with the deletion.
	 *
	 * @param id - The ID of the team to be deleted.
	 * @param dto - The DTO object containing additional information about the organization.
	 * @param userId - The ID of the user initiating the deletion.
	 * @returns Void.
	 * @throws ForbiddenException if the user is neither the team leader nor an admin/owner of the organization.
	 * @example
	 * await delete({
	 *   id: "team-id",
	 *   dto: { organizationId: "org-id" },
	 *   userId: "user-id"
	 * });
	 *
	 * // Deletes the team if the user has the required permissions.
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

		// Check if the user is an admin or owner of the organization
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		const hasPermission =
			userInOrg &&
			([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(userInOrg.role);

		// Verify if the user is the team leader or has admin/owner permissions
		if (!(await this.isTeamLeader(id, userId))) {
			if (!hasPermission) {
				throw new ForbiddenException(
					'Only the admin, owner, or team leader can delete this team'
				);
			}
		}

		// Delete the team
		await this.prisma.team.delete({ where: { id } });
	}
}
