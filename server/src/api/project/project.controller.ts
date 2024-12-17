import { CurrentUser } from '@/api/auth/decorators/user.decorator';
import { Permission } from '@/api/permission/decorators/permission.decorator';
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
import {
	AddProjectUserDto,
	ProjectDto,
	ProjectStatusDto
} from './dto/project.dto';
import { ProjectService } from './project.service';

/**
 * Controller for managing projects within an organization for a user.
 * Handles various CRUD operations for projects such as create, update, add user, etc.
 */
@Controller('user/organizations/projects')
export class ProjectController {
	// Injecting the ProjectService to handle the business logic related to projects.
	constructor(private readonly projectService: ProjectService) {}

	/**
	 * Get all active projects for a user from all organizations or a specific one.
	 * @param dto - The data transfer object containing the organization ID.
	 * @param userId - The ID of the current user making the request.
	 * @returns A list of projects based on the user's organization and project status.
	 * @throws UnauthorizedException - If the user does not have permission to view the projects.
	 */
	@UsePipes(new ValidationPipe())
	@Get()
	@HttpCode(200) // 200 OK for GET requests
	@Permission('viewResources') // Permission decorator to check if the user has the required permission
	async getAll(
		@Query('organizationId') organizationId: string,
		@CurrentUser('id') userId: string
	) {
		// If organizationId is provided, get projects from that organization, otherwise get all projects
		return organizationId
			? this.projectService.getAllFromOrg({
					userId,
					organizationId: organizationId
				})
			: this.projectService.getAll(userId); // Get projects from specific organization// Get all active projects from the organization
	}

	/**
	 * Create a new project.
	 * @param dto - The project details to be created.
	 * @param userId - The ID of the current user who is creating the project.
	 * @returns The newly created project.
	 * @throws ForbiddenException - If the user does not have permission to create a project.
	 */
	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(201) // 201 Created for POST requests
	@Permission('createProject') // Permission decorator to check if the user has the required permission
	async create(@Body() dto: ProjectDto, @CurrentUser('id') userId: string) {
		// Call the service to create the project
		return this.projectService.create({ dto, userId });
	}

	/**
	 * Add a new member to the project.
	 * @param dto - The details of the user to be added to the project.
	 * @param userId - The ID of the current user managing the project.
	 * @param id - The ID of the project where the user should be added.
	 * @returns The project user relationship after adding the user.
	 * @throws ForbiddenException - If the user does not have permission to manage users in the project.
	 * @throws NotFoundException - If the project or user does not exist.
	 */
	@UsePipes(new ValidationPipe())
	@Post('/add-user/:id')
	@HttpCode(201) // 201 Created for POST requests
	@Permission('manageUsers') // Permission decorator to check if the user has the required permission
	async addUser(
		@Body() dto: AddProjectUserDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		// Add user to the project by calling the service
		return this.projectService.addUser({ id, dto, userId });
	}

	/**
	 * Change the user's status in a project (e.g., Active, Banned, etc.).
	 * @param id - The ID of the project.
	 * @param dto - The new status for the user.
	 * @param userId - The ID of the current user managing the project.
	 * @returns The updated status of the project user.
	 * @throws ForbiddenException - If the user does not have permission to manage users in the project.
	 */
	@UsePipes(new ValidationPipe())
	@Put('/update-status/:id')
	@HttpCode(200) // 200 OK for PUT requests
	@Permission('manageUsers') // Permission decorator to check if the user has the required permission
	async updateStatus(
		@Param('id') id: string,
		@Body() dto: ProjectStatusDto, // This dto should contain the new status
		@CurrentUser('id') userId: string
	) {
		// Call the service to update the user status
		return this.projectService.updateStatus({ id, dto, userId });
	}

	/**
	 * Update the details of an existing project.
	 * @param id - The ID of the project to be updated.
	 * @param dto - The new project data.
	 * @param userId - The ID of the current user updating the project.
	 * @returns The updated project data.
	 * @throws ForbiddenException - If the user does not have permission to update the project.
	 */
	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200) // 200 OK for PUT requests
	@Permission('updateProject') // Permission decorator to check if the user has the required permission
	async update(
		@Param('id') id: string,
		@Body() dto: ProjectDto,
		@CurrentUser('id') userId: string
	) {
		// Call the service to update the project
		return this.projectService.update({ id, dto, userId });
	}

	/**
	 * Exit the project (Leave the project).
	 * @param userId - The ID of the user who wants to exit the project.
	 * @param id - The ID of the project the user is leaving.
	 * @returns A confirmation response that the user has exited the project.
	 * @throws ForbiddenException - If the user cannot leave the project (e.g., admins, owners).
	 */
	@Delete('/exit/:id')
	@HttpCode(204) // 204 No Content for DELETE requests (no content in response body)
	@Permission('viewResources') // Permission decorator to check if the user has the required permission
	async exit(@CurrentUser('id') userId: string, @Param('id') id: string) {
		// Call the service to handle exiting the project
		return this.projectService.exit({ id, userId });
	}

	/**
	 * Delete a project.
	 * @param id - The ID of the project to be deleted.
	 * @param userId - The ID of the current user who is deleting the project.
	 * @returns A confirmation response that the project has been deleted.
	 * @throws ForbiddenException - If the user does not have permission to delete the project.
	 */
	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(204) // 204 No Content for DELETE requests (no content in response body)
	@Permission('deleteProject') // Permission decorator to check if the user has the required permission
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		// Call the service to handle project deletion
		return this.projectService.delete({ id, userId });
	}
}
