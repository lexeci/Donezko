import { PrismaService } from '@/src/prisma.service';
import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { AccessStatus, OrgRole, Team, TeamRole } from '@prisma/client';
import { TeamDto } from './dto/team.dto';

@Injectable()
export class TeamService {
	constructor(private readonly prisma: PrismaService) {}

	// Перевірка доступу користувача до проекту та організації
	async checkUserAccess(
		orgId: string,
		projectId: string,
		userId: string,
		roleCheck: boolean = false
	): Promise<void> {
		// Перевірка, чи користувач є в організації
		const userInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId: userId, organizationId: orgId }
		});

		if (!userInOrg) {
			throw new NotFoundException('User is not part of the organization');
		}

		// Перевірка, чи користувач має доступ до проекту
		const userInProject = await this.prisma.projectUser.findFirst({
			where: {
				userId: userId,
				projectId: projectId,
				projectStatus: AccessStatus.ACTIVE
			}
		});

		if (!userInProject) {
			throw new NotFoundException('User does not have access to this project');
		}

		// Перевірка статусу користувача (не повинно бути banned або viewer)
		if (
			userInOrg.organizationStatus === AccessStatus.BANNED ||
			userInOrg.role === OrgRole.VIEWER
		) {
			throw new ForbiddenException(
				'User does not have permission to access this resource'
			);
		}

		// Якщо потрібно перевірити роль користувача (адміністратор чи власник)
		if (
			roleCheck &&
			userInOrg.role !== OrgRole.ADMIN &&
			userInOrg.role !== OrgRole.OWNER
		) {
			throw new ForbiddenException(
				'Only admins or owners can perform this action'
			);
		}
	}

	// Перевірка, чи є користувач лідером команди
	async isTeamLeader(
		orgId: string,
		teamId: string,
		userId: string
	): Promise<boolean> {
		const teamUser = await this.prisma.teamUser.findFirst({
			where: { teamId: teamId, userId: userId, teamStatus: AccessStatus.ACTIVE }
		});
		if (!teamUser) throw new NotFoundException('User not found in the team');

		// Перевірка, чи є користувач лідером
		const team = await this.prisma.team.findUnique({
			where: { id: teamId },
			include: { teamUsers: true }
		});

		// Лідер це той, хто був першим доданий або хто має спеціальний статус
		const leader = team?.teamUsers.find(user => user.role === TeamRole.LEADER);
		return leader?.userId === userId;
	}

	// Отримання всіх команд для проекту
	async getAll(
		orgId: string,
		projectId: string,
		userId: string
	): Promise<Team[]> {
		return await this.prisma.team.findMany({
			where: {
				organizationId: orgId,
				teamUsers: {
					some: { userId: userId, teamStatus: AccessStatus.ACTIVE }
				},
				projectTeams: {
					some: { projectId }
				}
			}
		});
	}

	// Створення команди з перевіркою на дублювання
	async create(
		orgId: string,
		projectId: string,
		dto: TeamDto,
		userId: string
	): Promise<Team> {
		// Перевірка на дублювання команди
		const existingTeam = await this.prisma.team.findFirst({
			where: {
				id: projectId,
				title: dto.title,
				organizationId: orgId
			}
		});
		if (existingTeam) {
			throw new ForbiddenException(
				`Project "${dto.title}" already exists in this organization.`
			);
		}

		// Створення команди і автоматичне призначення лідера
		return await this.prisma.team.create({
			data: {
				...dto,
				organizationId: orgId,
				projectTeams: {
					create: { projectId }
				},
				teamUsers: {
					create: {
						userId: userId,
						role: TeamRole.LEADER,
						teamStatus: AccessStatus.ACTIVE
					}
				}
			}
		});
	}

	// Отримання команди по ID
	async getById(
		orgId: string,
		projectId: string,
		teamId: string
	): Promise<Team | null> {
		return await this.prisma.team.findFirst({
			where: {
				id: teamId,
				organizationId: orgId,
				projectTeams: {
					some: { projectId }
				}
			}
		});
	}

	// Оновлення команди
	async update(
		orgId: string,
		projectId: string,
		teamId: string,
		dto: TeamDto,
		userId: string
	): Promise<Team> {
		// Перевірка, чи користувач є лідером
		if (!(await this.isTeamLeader(orgId, teamId, userId))) {
			throw new ForbiddenException('Only team leader can update the team');
		}

		return await this.prisma.team.update({
			where: { id: teamId },
			data: {
				...dto
			}
		});
	}

	// Видалення команди
	async delete(
		orgId: string,
		projectId: string,
		teamId: string,
		userId: string
	): Promise<void> {
		// Перевірка, чи користувач є лідером або тим, хто створив команду
		const team = await this.prisma.team.findUnique({
			where: { id: teamId },
			include: { teamUsers: true }
		});
		if (!team) throw new NotFoundException('Team not found');

		// Перевіряємо, чи є користувач лідером або створював команду
		const isLeader = team.teamUsers.some(
			user => user.role === TeamRole.LEADER && user.userId === userId
		);
		if (!isLeader) {
			throw new ForbiddenException(
				'Only the team leader or creator can delete the team'
			);
		}

		// Видалення команди
		await this.prisma.team.delete({
			where: { id: teamId }
		});
	}

	// Додавання користувача до команди
	async addUserToTeam(
		orgId: string,
		projectId: string,
		teamId: string,
		dto: TeamDto,
		userId: string
	): Promise<Team> {
		// Перевірка доступу користувача
		await this.checkUserAccess(orgId, projectId, userId);

		// Перевірка чи користувач є лідером команди
		if (!(await this.isTeamLeader(orgId, teamId, userId))) {
			throw new ForbiddenException(
				'Only the team leader can add users to the team'
			);
		}

		// Додавання користувача
		await this.prisma.teamUser.create({
			data: {
				teamId,
				userId: dto.userId,
				role: dto.role,
				teamStatus: 'ACTIVE'
			}
		});
		return this.getById(orgId, projectId, teamId);
	}

	// Видалення користувача з команди
	async removeUserFromTeam(
		orgId: string,
		projectId: string,
		teamId: string,
		userId: string,
		currentUserId: string
	): Promise<void> {
		// Перевірка доступу користувача
		await this.checkUserAccess(orgId, projectId, currentUserId);

		// Перевірка, чи користувач є лідером
		if (!(await this.isTeamLeader(orgId, teamId, currentUserId))) {
			throw new ForbiddenException(
				'Only the team leader can remove users from the team'
			);
		}

		// Видалення користувача з команди
		await this.prisma.teamUser.delete({
			where: { userId_teamId: { teamId, userId } }
		});
	}
}
