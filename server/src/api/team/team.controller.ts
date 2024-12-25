import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { Team } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Permission } from '../permission/decorators/permission.decorator';
import {
	CreateTeamDto,
	DeleteTeamDto,
	LinkTeamToProjectDto,
	ManageTeamDto,
	TeamDto
} from './dto/team.dto';
import { TeamService } from './team.service';

/**
 * TeamController - Controller for managing teams within an organization.
 *
 * This controller handles all the HTTP routes related to teams, such as creating, updating, deleting teams,
 * and managing users within teams. It includes endpoints for both team management and user management within teams.
 *
 * @module TeamController
 */
@Controller('user/organizations/teams')
export class TeamController {
	constructor(private readonly teamService: TeamService) {}

	/**
	 * Fetches all teams for organization.
	 *
	 * This endpoint retrieves the list of teams in organization, along with their members,
	 * and is accessible by users with the 'viewResources' permission.
	 *
	 * @param dto - Data Transfer Object containing filter parameters for fetching teams.
	 * @param userId - The ID of the current user making the request.
	 * @returns A list of teams with their users.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Permission('viewResources')
	@Get()
	async getAllByOrg(
		@Query('organizationId') organizationId: string,
		@CurrentUser('id') userId: string
	) {
		return await this.teamService.getAllByOrg({
			userId,
			organizationId
		});
	}

	/**
	 * Fetches all teams for a project.
	 *
	 * This endpoint retrieves the list of teams in a project, along with their members,
	 * and is accessible by users with the 'viewResources' permission.
	 *
	 * @param dto - Data Transfer Object containing filter parameters for fetching teams.
	 * @param userId - The ID of the current user making the request.
	 * @returns A list of teams with their users.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Permission('viewResources')
	@Get('/project')
	async getAllByProject(
		@Query('organizationId') organizationId: string,
		@Query('projectId') projectId: string,
		@CurrentUser('id') userId: string
	) {
		return await this.teamService.getAllByProject({
			userId,
			organizationId,
			projectId
		});
	}

	/**
	 * Fetches all teams associated with the current user.
	 *
	 * This endpoint retrieves the list of teams in which the user is an active member.
	 *
	 * @param userId - The ID of the current user making the request.
	 * @returns A list of teams with their users.
	 */
	@HttpCode(200)
	@Permission('viewResources') // Вказуємо відповідний дозвіл, якщо потрібен
	@Get('user-teams') // Новий шлях для цього ендпоінта
	async getAllByUser(@CurrentUser('id') userId: string) {
		return await this.teamService.getAllByUserId(userId);
	}

	/**
	 * Fetches a team by its ID.
	 *
	 * This endpoint retrieves a specific team, identified by its ID, including the users in the team.
	 * It requires the 'viewResources' permission.
	 *
	 * @param dto - Data Transfer Object containing the filter parameters for the team.
	 * @param id - The ID of the team to fetch.
	 * @param userId - The ID of the current user making the request.
	 * @returns A team object with its associated users.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get(':id')
	@Permission('viewResources')
	async getById(
		@Query('organizationId') organizationId: string,
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return await this.teamService.getById({ userId, id, organizationId });
	}

	/**
	 * Fetches all users from team by its ID.
	 *
	 * This endpoint retrieves all users that are related to team, identified by its ID, including the user info.
	 * It requires the 'viewResources' permission.
	 *
	 * @param organizationId - The ID of the organization
	 * @param id - The ID of the team to fetch.
	 * @param userId - The ID of the current user making the request.
	 * @returns A team object with its associated users.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get(':id/users')
	@Permission('viewResources')
	async getAllUsers(
		@Query('organizationId') organizationId: string,
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return await this.teamService.getAllUsers({ userId, id, organizationId });
	}

	/**
	 * Get the role of the current user in a specific team.
	 * @param organizationId The ID of the organization.
	 * @param userId The ID of the current user.
	 * @returns The role of the user in the organization.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get(':id/role')
	@Permission('viewResources')
	async getTeamRole(
		@Param('id') id: string,
		@Param('organizationId') organizationId: string,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.getTeamRole({
			id,
			userId,
			organizationId
		});
	}

	/**
	 * Creates a new team.
	 *
	 * This endpoint creates a new team for the project. The user must have the 'createTeam' permission.
	 *
	 * @param dto - Data Transfer Object containing the necessary information to create the team.
	 * @param userId - The ID of the current user creating the team.
	 * @returns The newly created team.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Post()
	@Permission('createTeam')
	async create(
		@Body() dto: CreateTeamDto,
		@CurrentUser('id') userId: string
	): Promise<Team> {
		return await this.teamService.create({
			dto,
			userId
		});
	}

	/**
	 * Updates a team by its ID.
	 *
	 * This endpoint allows updating an existing team, and is restricted to users with the 'updateTeam' permission.
	 *
	 * @param id - The ID of the team to update.
	 * @param userId - The ID of the current user updating the team.
	 * @param dto - Data Transfer Object containing the updated team details.
	 * @returns The updated team.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Permission('updateTeam')
	async update(
		@Param('id') id: string,
		@CurrentUser('id') userId: string,
		@Body() dto: TeamDto
	) {
		return await this.teamService.update({ id, dto, userId });
	}

	/**
	 * Deletes a team by its ID.
	 *
	 * This endpoint allows deleting a team, and is accessible by users with the 'deleteTeam' permission.
	 *
	 * @param id - The ID of the team to delete.
	 * @param dto - Data Transfer Object containing the information needed for deletion.
	 * @param userId - The ID of the current user deleting the team.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(204)
	@Delete(':id')
	@Permission('deleteTeam')
	async delete(
		@Param('id') id: string,
		@Body() dto: DeleteTeamDto,
		@CurrentUser('id') userId: string
	): Promise<void> {
		await this.teamService.delete({ id, dto, userId });
	}

	/**
	 * Links a team to a project.
	 *
	 * This endpoint allows a team leader to link their team to a specific project within an organization.
	 *
	 * @param id - The ID of the team to link.
	 * @param dto - Data Transfer Object containing the project ID and organization ID.
	 * @param userId - The ID of the current user linking the team to the project.
	 * @returns The updated team.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id/link-project')
	@Permission('updateTeam')
	async linkToProject(
		@Param('id') id: string,
		@Body() dto: LinkTeamToProjectDto,
		@CurrentUser('id') userId: string
	) {
		return await this.teamService.linkToProject({ id, dto, userId });
	}

	/**
	 * UnLinks a team to a project.
	 *
	 * This endpoint allows a team leader to unlink their team from a specific project within an organization.
	 *
	 * @param id - The ID of the team to link.
	 * @param dto - Data Transfer Object containing the project ID and organization ID.
	 * @param userId - The ID of the current user linking the team to the project.
	 * @returns The updated team.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id/unlink-project')
	@Permission('updateTeam')
	async unlinkFromProject(
		@Param('id') id: string,
		@Body() dto: LinkTeamToProjectDto,
		@CurrentUser('id') userId: string
	) {
		return await this.teamService.unlinkFromProject({ id, dto, userId });
	}

	/**
	 * Adds a user to a team.
	 *
	 * This endpoint adds a user to a specified team. The current user must have the 'manageTeamUsers' permission.
	 *
	 * @param id - The ID of the team to which the user will be added.
	 * @param dto - Data Transfer Object containing the details of the user to add.
	 * @param userId - The ID of the current user adding the user to the team.
	 * @returns The updated team with its users.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Post(':id/users')
	@Permission('manageTeamUsers')
	async addUserToTeam(
		@Param('id') id: string,
		@Body() dto: ManageTeamDto,
		@CurrentUser('id') userId: string
	) {
		return await this.teamService.addUserToTeam({ id, dto, userId });
	}

	/**
	 * Transfers leadership within a team.
	 *
	 * This endpoint transfers the leadership of a team to another user. The current user must have the 'manageTeamUsers' permission.
	 *
	 * @param id - The ID of the team to transfer leadership in.
	 * @param dto - Data Transfer Object containing the new leader's details.
	 * @param userId - The ID of the current user initiating the leadership transfer.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id/transfer-leader')
	@Permission('manageTeamUsers')
	async transferLeadership(
		@Param('id') id: string,
		@Body() dto: ManageTeamDto,
		@CurrentUser('id') userId: string
	): Promise<void> {
		await this.teamService.transferLeadership({
			id,
			dto,
			userId
		});
	}

	/**
	 * Allows a user to exit a team.
	 *
	 * This endpoint allows a user to leave a team. It requires the 'viewResources' permission and removes the user from the team.
	 *
	 * @param id - The ID of the team the user is exiting.
	 * @param userId - The ID of the current user who is exiting the team.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(204)
	@Delete(':id/users/exit')
	@Permission('viewResources')
	async exitFromTeam(
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	): Promise<void> {
		await this.teamService.exitFromTeam({ id, userId });
	}

	/**
	 * Removes a user from a team.
	 *
	 * This endpoint allows a user with the 'manageTeamUsers' permission to remove another user from the team.
	 *
	 * @param id - The ID of the team from which to remove a user.
	 * @param dto - Data Transfer Object containing the details of the user to remove.
	 * @param userId - The ID of the current user removing the other user.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(204)
	@Delete(':id/users')
	@Permission('manageTeamUsers')
	async removeUserFromTeam(
		@Param('id') id: string,
		@Body() dto: ManageTeamDto,
		@CurrentUser('id') userId: string
	): Promise<void> {
		await this.teamService.removeUserFromTeam({
			id,
			dto,
			userId
		});
	}
}
