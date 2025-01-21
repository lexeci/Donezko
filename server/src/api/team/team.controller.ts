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
	 * Fetches all teams for the organization.
	 *
	 * This endpoint retrieves the list of teams within an organization, along with their members,
	 * and is accessible by users with the 'viewResources' permission. The user must provide the organization ID
	 * to retrieve the teams associated with it.
	 *
	 * @param organizationId - The ID of the organization to fetch teams for.
	 * @param userId - The ID of the current user making the request. This is used for permission validation.
	 * @returns A list of teams associated with the specified organization, along with their members.
	 * @example
	 * GET /user/organizations/teams?organizationId=org123
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Permission('viewResources')
	@Get()
	async getAllByOrg(
		@Query('organizationId') organizationId: string,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.getAllByOrg({
			userId,
			organizationId
		});
	}

	/**
	 * Fetches all teams for a specific project.
	 *
	 * This endpoint retrieves the list of teams associated with a project, along with their members,
	 * and is accessible by users with the 'viewResources' permission. The user must provide the organization ID
	 * and project ID to fetch teams linked to that specific project.
	 *
	 * @param organizationId - The ID of the organization to fetch teams for.
	 * @param projectId - The ID of the project to fetch teams for.
	 * @param userId - The ID of the current user making the request. This is used for permission validation.
	 * @returns A list of teams associated with the specified project, along with their members.
	 * @example
	 * GET /user/organizations/teams/project?organizationId=org123&projectId=proj456
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
	 * This endpoint retrieves the list of teams in which the user is an active member. It helps the user
	 * view all the teams they are part of, including their associated members and other details.
	 * The user must have the 'viewResources' permission to access this endpoint.
	 *
	 * @param userId - The ID of the current user making the request. This identifies the teams associated with the user.
	 * @returns A list of teams that the user is a member of, along with their users.
	 * @example
	 * GET /user/organizations/teams/user-teams
	 */
	@HttpCode(200)
	@Permission('viewResources') // Specifies the necessary permission for access
	@Get('user-teams') // Endpoint to fetch teams associated with the current user
	async getAllByUser(@CurrentUser('id') userId: string) {
		return await this.teamService.getAllByUserId(userId);
	}

	/**
	 * Fetches a team by its ID.
	 *
	 * This endpoint retrieves a specific team, identified by its ID, including the users in the team.
	 * It requires the 'viewResources' permission to ensure that the current user is authorized to view
	 * the team details.
	 *
	 * @param organizationId - The ID of the organization to which the team belongs.
	 * @param id - The ID of the team to fetch.
	 * @param userId - The ID of the current user making the request. This identifies the requester.
	 * @returns A team object with its associated users, including details such as the team members and their roles.
	 * @example
	 * GET /user/organizations/teams/:id?organizationId=123
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
	 * Fetches all users from a team by its ID.
	 *
	 * This endpoint retrieves all users that are associated with a specific team, identified by its ID,
	 * including detailed user information. The request requires the 'viewResources' permission to ensure
	 * that the current user is authorized to view the team members.
	 *
	 * @param organizationId - The ID of the organization to which the team belongs.
	 * @param id - The ID of the team for which users are being fetched.
	 * @param userId - The ID of the current user making the request. This identifies the requester.
	 * @returns A list of users who are associated with the specified team, including their roles and other details.
	 * @example
	 * GET /user/organizations/teams/:id/users?organizationId=123
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
	 *
	 * This endpoint retrieves the role of the current user within a team, identified by its ID,
	 * in a specific organization. The request requires the 'viewResources' permission to ensure
	 * that the current user is authorized to access role information.
	 *
	 * @param id - The ID of the team for which the user's role is being fetched.
	 * @param organizationId - The ID of the organization that owns the team.
	 * @param userId - The ID of the current user making the request.
	 * @returns The role of the current user within the specified team.
	 * @example
	 * GET /teams/:id/role?organizationId=123
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
	 * This endpoint allows the current user to create a new team within the project.
	 * The user must have the 'createTeam' permission to be authorized to create a team.
	 *
	 * @param dto - Data Transfer Object (DTO) containing the necessary details for creating the team, such as team name, description, etc.
	 * @param userId - The ID of the current user creating the team.
	 * @returns The newly created team object, which includes details about the team and its initial state.
	 * @example
	 * POST /teams
	 * Body: { "name": "New Team", "projectId": "xyz", "members": ["user1", "user2"] }
	 * Response: { "id": "123", "name": "New Team", "projectId": "xyz", "members": ["user1", "user2"] }
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
	 * This endpoint allows the current user to update an existing team within the organization or project.
	 * The user must have the 'updateTeam' permission to be authorized to perform the update.
	 *
	 * @param id - The ID of the team to update.
	 * @param userId - The ID of the current user performing the update.
	 * @param dto - Data Transfer Object (DTO) containing the updated details of the team, such as team name, description, or other attributes.
	 * @returns The updated team object, including any modifications made.
	 * @example
	 * PUT /teams/:id
	 * Body: { "name": "Updated Team Name", "members": ["user1", "user3"] }
	 * Response: { "id": "123", "name": "Updated Team Name", "members": ["user1", "user3"] }
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
	 * This endpoint allows the current user to delete a specific team. It is accessible only by users
	 * who have the 'deleteTeam' permission. Once the team is deleted, it will no longer be available
	 * for any operations.
	 *
	 * @param id - The ID of the team to delete.
	 * @param dto - Data Transfer Object (DTO) containing the details needed for deletion, such as validation or specific conditions.
	 * @param userId - The ID of the current user performing the deletion.
	 * @returns A void response indicating that the deletion was successful.
	 * @example
	 * DELETE /teams/:id
	 * Body: { "reason": "No longer needed" }
	 * Response: 204 No Content (indicating successful deletion with no body)
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
	 * The user must have the 'updateTeam' permission to perform this operation. Once linked, the team
	 * will be associated with the given project, and members of the team will have access to project-related resources.
	 *
	 * @param id - The ID of the team to link.
	 * @param dto - Data Transfer Object (DTO) containing the project ID and organization ID to which the team should be linked.
	 * @param userId - The ID of the current user performing the linking operation.
	 * @returns The updated team object with the new project association.
	 * @example
	 * PUT /teams/:id/link-project
	 * Body: { "projectId": "project123", "organizationId": "org456" }
	 * Response: 200 OK with the updated team object, including project association.
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
	 * Unlinks a team from a project.
	 *
	 * This endpoint allows a team leader to unlink their team from a specific project within an organization.
	 * The user must have the 'updateTeam' permission to perform this operation. Once unlinked, the team will no longer
	 * have access to the project, and its members will be disconnected from the project-related resources.
	 *
	 * @param id - The ID of the team to unlink.
	 * @param dto - Data Transfer Object (DTO) containing the project ID and organization ID from which the team should be unlinked.
	 * @param userId - The ID of the current user performing the unlinking operation.
	 * @returns The updated team object without the project association.
	 * @example
	 * PUT /teams/:id/unlink-project
	 * Body: { "projectId": "project123", "organizationId": "org456" }
	 * Response: 200 OK with the updated team object, without the project association.
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
	 * This endpoint allows adding a user to a specified team. The user making the request must have the 'manageTeamUsers' permission.
	 * The user to be added is identified by the details provided in the request body.
	 * Upon successful addition, the team will be updated with the new user.
	 *
	 * @param id - The ID of the team to which the user will be added.
	 * @param dto - Data Transfer Object (DTO) containing the user details, including user ID and role.
	 * @param userId - The ID of the current user adding the user to the team.
	 * @returns The updated team object with its new user included.
	 * @example
	 * POST /teams/:id/users
	 * Body: { "userId": "user123", "role": "member" }
	 * Response: 201 Created with the updated team object, including the newly added user.
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
	 * This endpoint allows transferring the leadership of a team to another user. The user making the request must have the 'manageTeamUsers' permission.
	 * Upon successful transfer, the new leader will assume the responsibilities of managing the team.
	 *
	 * @param id - The ID of the team to transfer leadership in.
	 * @param dto - Data Transfer Object (DTO) containing the new leader's details, including user ID and role.
	 * @param userId - The ID of the current user initiating the leadership transfer.
	 * @returns Void. Upon success, the team leadership is updated.
	 * @example
	 * PUT /teams/:id/transfer-leader
	 * Body: { "userId": "user456", "role": "leader" }
	 * Response: 200 OK with an updated team leadership.
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
	 * Updates the status of a team.
	 *
	 * This endpoint allows updating the status of a team, such as making it active or inactive. The user making the request must have the 'manageTeamUsers' permission.
	 *
	 * @param id - The ID of the team whose status is to be updated.
	 * @param dto - Data Transfer Object (DTO) containing the new status details (e.g., active, inactive).
	 * @param userId - The ID of the current user initiating the status update.
	 * @returns Void. Upon success, the team status is updated.
	 * @example
	 * PUT /teams/:id/update-status
	 * Body: { "status": "inactive" }
	 * Response: 200 OK with an updated team status.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id/update-status')
	@Permission('manageTeamUsers')
	async updateStatus(
		@Param('id') id: string,
		@Body() dto: ManageTeamDto,
		@CurrentUser('id') userId: string
	): Promise<void> {
		await this.teamService.updateStatus({
			id,
			dto,
			userId
		});
	}

	/**
	 * Allows a user to exit a team.
	 *
	 * This endpoint allows a user to leave a team they are part of. The user must have the 'viewResources' permission.
	 * Upon success, the user is removed from the team.
	 *
	 * @param id - The ID of the team the user is exiting.
	 * @param userId - The ID of the current user who is exiting the team.
	 * @returns Void. Upon success, the user is removed from the team.
	 * @example
	 * DELETE /teams/:id/users/exit
	 * Response: 204 No Content if the user successfully exits the team.
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
	 * The user is identified by the provided user ID in the request body.
	 *
	 * @param id - The ID of the team from which to remove a user.
	 * @param dto - Data Transfer Object containing the details of the user to remove.
	 * @param userId - The ID of the current user performing the removal action.
	 * @returns Void. Upon success, the user is removed from the team.
	 * @example
	 * DELETE /teams/:id/users
	 * Request Body: { "userId": "user-to-remove-id" }
	 * Response: 204 No Content if the user was successfully removed from the team.
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
