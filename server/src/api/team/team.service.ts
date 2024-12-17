import { PrismaService } from '@/src/prisma.service';
import { TeamWithUsers } from '@/src/types/teams.types';
import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { AccessStatus, OrgRole, Team, TeamRole } from '@prisma/client';
import {
	CreateTeamDto,
	DeleteTeamDto,
	GetTeamDto,
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
	 * @param orgId - The organization ID.
	 * @param projectId - The project ID.
	 * @param currentUserId - The ID of the current user.
	 * @throws ForbiddenException if the user lacks access.
	 */
	private async checkAccess(
		orgId: string,
		projectId: string,
		currentUserId: string
	): Promise<void> {
		const currentUserInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId: currentUserId, organizationId: orgId }
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

		const currentUserInProject = await this.prisma.projectUser.findFirst({
			where: {
				userId: currentUserId,
				projectId,
				projectStatus: AccessStatus.ACTIVE
			}
		});

		if (!currentUserInProject) {
			throw new ForbiddenException('No access to the specified project');
		}
	}

	/**
	 * Verifies if the user is part of the organization and is active.
	 *
	 * @param orgId - The organization ID.
	 * @param userId - The user ID to check.
	 * @throws NotFoundException if the user is not part of the organization.
	 * @throws ForbiddenException if the user is not active in the organization.
	 */
	private async checkUserInOrganization(
		orgId: string,
		userId: string
	): Promise<void> {
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: orgId }
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
	async getAllByUserId(userId: string): Promise<TeamWithUsers[]> {
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
				organizationId: true,
				organization: {
					select: {
						title: true // Get the title (name) of the organization
					}
				},
				teamUsers: true,
				tasks: true
			}
		});
	}

	/**
	 * Retrieves all active teams for a project.
	 *
	 * This method returns a list of teams for the specified project, filtered by the user's activity.
	 * The user must have access to the organization and project.
	 *
	 * @param dto - The DTO object containing the organization and project information.
	 * @param userId - The current user ID.
	 * @returns The list of teams with their members.
	 */
	async getAllByOrgProject({
		dto,
		userId
	}: {
		dto: GetTeamDto;
		userId: string;
	}): Promise<TeamWithUsers[]> {
		const { organizationId, projectId } = dto;

		await this.checkAccess(organizationId, projectId, userId);

		return this.prisma.team.findMany({
			where: {
				organizationId,
				projectTeams: { some: { projectId } },
				teamUsers: { some: { userId, teamStatus: AccessStatus.ACTIVE } }
			},
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
				organizationId: true,
				teamUsers: true,
				tasks: true
			}
		});
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
		dto
	}: {
		userId: string;
		id: string;
		dto: GetTeamDto;
	}): Promise<TeamWithUsers> {
		const { organizationId, projectId } = dto;

		await this.checkAccess(organizationId, projectId, userId);

		const team = await this.prisma.team.findFirst({
			where: { id, organizationId, projectTeams: { some: { projectId } } },
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
				organizationId: true,
				teamUsers: true,
				tasks: true
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
		const { projectId, organizationId } = dto;

		await this.checkAccess(organizationId, projectId, userId);

		const duplicate = await this.prisma.team.findFirst({
			where: {
				organizationId,
				projectTeams: { some: { projectId } },
				title: dto.title
			}
		});

		if (duplicate) {
			throw new ForbiddenException('A team with this title already exists');
		}

		return this.prisma.team.create({
			data: {
				...dto,
				projectTeams: { create: { projectId } },
				teamUsers: {
					create: {
						userId,
						role: TeamRole.LEADER,
						teamStatus: AccessStatus.ACTIVE
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
	}): Promise<Team> {
		const { organizationId, projectId } = dto;

		await this.checkAccess(organizationId, projectId, userId);

		if (!(await this.isTeamLeader(id, userId))) {
			throw new ForbiddenException('Only the team leader can update this team');
		}

		return this.prisma.team.update({
			where: { id },
			data: { ...dto }
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
	}): Promise<TeamWithUsers> {
		const { organizationId, teamUserId } = dto;

		await this.checkAccess(organizationId, dto.projectId, userId);

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

		return this.getById({ userId, id, dto });
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

		await this.checkAccess(organizationId, dto.projectId, userId);

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

		await this.checkAccess(organizationId, dto.projectId, userId);

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
		const { organizationId, projectId } = dto;

		await this.checkAccess(organizationId, projectId, userId);

		if (!(await this.isTeamLeader(id, userId))) {
			throw new ForbiddenException('Only the team leader can delete the team');
		}

		await this.prisma.team.delete({ where: { id } });
	}
}
