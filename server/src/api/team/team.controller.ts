import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { Team } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Permission } from '../permission/decorators/permission.decorator';
import { TeamDto } from './dto/team.dto';
import { TeamService } from './team.service';

@Controller('user/organizations/:orgId/projects/:projectId/teams')
export class TeamController {
	constructor(private readonly teamService: TeamService) {}

	// Отримання списку всіх команд для проєкту
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Permission('viewResources')
	@Get()
	async getAll(
		@Param('orgId') orgId: string,
		@Param('projectId') projectId: string,
		@CurrentUser('id') userId: string
	): Promise<Team[]> {
		return await this.teamService.getAll(orgId, projectId, userId);
	}

	// Створення нової команди
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Permission('createTeam')
	async create(
		@Param('orgId') orgId: string,
		@Param('projectId') projectId: string,
		@Body() dto: TeamDto,
		@CurrentUser('id') userId: string
	): Promise<Team> {
		return await this.teamService.create(orgId, projectId, dto, userId);
	}

	// Отримання команди за її id
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get(':teamId')
	@Permission('viewResources')
	async getById(
		@Param('orgId') orgId: string,
		@Param('projectId') projectId: string,
		@Param('teamId') teamId: string
	): Promise<Team> {
		const team = await this.teamService.getById(orgId, projectId, teamId);
		if (!team) throw new NotFoundException('Team not found');
		return team;
	}

	// Оновлення команди за її id
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':teamId')
	@Permission('updateTeam')
	async update(
		@Param('orgId') orgId: string,
		@Param('projectId') projectId: string,
		@Param('teamId') teamId: string,
		@CurrentUser('id') userId: string,
		@Body() dto: TeamDto
	): Promise<Team> {
		return await this.teamService.update(orgId, projectId, teamId, dto, userId);
	}

	// Видалення команди за її id
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete(':teamId')
	@HttpCode(204)
	@Permission('deleteTeam')
	async delete(
		@Param('orgId') orgId: string,
		@Param('projectId') projectId: string,
		@Param('teamId') teamId: string,
		@CurrentUser('id') userId: string
	): Promise<void> {
		await this.teamService.delete(orgId, projectId, teamId, userId);
	}

	// Додавання користувача до команди
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(':teamId/users')
	@Permission('manageTeamUsers')
	async addUserToTeam(
		@Param('orgId') orgId: string,
		@Param('projectId') projectId: string,
		@Param('teamId') teamId: string,
		@CurrentUser('id') userId: string,
		@Body() dto: TeamDto
	): Promise<Team> {
		return await this.teamService.addUserToTeam(
			orgId,
			projectId,
			teamId,
			dto,
			userId
		);
	}

	// Видалення користувача з команди
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete(':teamId/users/:userId')
	@Permission('manageTeamUsers')
	async removeUserFromTeam(
		@Param('orgId') orgId: string,
		@Param('projectId') projectId: string,
		@Param('teamId') teamId: string,
		@Param('userId') userId: string,
		@CurrentUser('id') currentUserId: string
	): Promise<void> {
		await this.teamService.removeUserFromTeam(
			orgId,
			projectId,
			teamId,
			userId,
			currentUserId
		);
	}
}
