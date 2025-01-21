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
	ManageProjectUserDto,
	ProjectDto,
	ProjectStatusDto,
	TransferManagerDto
} from './dto/project.dto';
import { ProjectService } from './project.service';

/**
 * Controller for managing projects within an organization for a user.
 * Handles various CRUD operations for projects such as create, update, add user, etc.
 */
@Controller('user/organizations/projects')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	/**
	 * Retrieves all active projects for a user from all organizations or a specific one.
	 * @param organizationId - ID of the organization to filter projects.
	 * @param projectId - ID of the project for additional filtering.
	 * @param userId - Current user's ID.
	 * @returns List of projects based on filters and user's permissions.
	 * @example
	 * GET /user/organizations/projects?organizationId=1
	 */
	@UsePipes(new ValidationPipe())
	@Get()
	@HttpCode(200)
	@Permission('viewResources')
	async getAll(
		@Query('organizationId') organizationId: string,
		@Query('projectId') projectId: string,
		@CurrentUser('id') userId: string
	) {
		return organizationId
			? this.projectService.getAllFromOrg({ userId, organizationId, projectId })
			: this.projectService.getAll(userId);
	}

	/**
	 * Retrieves details of a specific project by its ID.
	 * @param id - ID of the project.
	 * @param userId - Current user's ID.
	 * @returns Project details.
	 * @example
	 * GET /user/organizations/projects/1
	 */
	@UsePipes(new ValidationPipe())
	@Get(':id')
	@HttpCode(200)
	@Permission('viewResources')
	async getById(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.projectService.getById({ id, userId });
	}

	/**
	 * Retrieves the user's role within a specific project.
	 * @param id - ID of the project.
	 * @param userId - Current user's ID.
	 * @returns Role information within the project.
	 * @example
	 * GET /user/organizations/projects/1/role
	 */
	@UsePipes(new ValidationPipe())
	@Get(':id/role')
	@HttpCode(200)
	@Permission('viewResources')
	async getRole(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.projectService.getRole({ id, userId });
	}

	/**
	 * Creates a new project.
	 * @param dto - Project data.
	 * @param userId - Current user's ID.
	 * @returns The created project.
	 * @example
	 * POST /user/organizations/projects
	 */
	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(201)
	@Permission('createProject')
	async create(@Body() dto: ProjectDto, @CurrentUser('id') userId: string) {
		return this.projectService.create({ dto, userId });
	}

	/**
	 * Retrieves all users in a specific project.
	 * @param id - ID of the project.
	 * @param userId - Current user's ID.
	 * @returns List of users in the project.
	 * @example
	 * GET /user/organizations/projects/1/users
	 */
	@UsePipes(new ValidationPipe())
	@Get(':id/users')
	@HttpCode(200)
	@Permission('viewResources')
	async getAllUsers(
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.getAllUsers({ id, userId });
	}

	/**
	 * Adds a new member to a project.
	 * @param dto - User details to add.
	 * @param userId - Current user's ID.
	 * @param id - ID of the project.
	 * @returns Project-user relationship after addition.
	 * @example
	 * POST /user/organizations/projects/1/add-user
	 */
	@UsePipes(new ValidationPipe())
	@Post(':id/add-user')
	@HttpCode(201)
	@Permission('manageUsers')
	async addUser(
		@Body() dto: ManageProjectUserDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.projectService.addUser({ id, dto, userId });
	}

	/**
	 * Removes a member from a project.
	 * @param dto - User details to remove.
	 * @param userId - Current user's ID.
	 * @param id - ID of the project.
	 * @returns Project-user relationship after removal.
	 * @example
	 * POST /user/organizations/projects/1/remove-user
	 */
	@UsePipes(new ValidationPipe())
	@Post(':id/remove-user')
	@HttpCode(201)
	@Permission('manageUsers')
	async removeUser(
		@Body() dto: ManageProjectUserDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.projectService.removeUser({ id, dto, userId });
	}

	/**
	 * Updates details of an existing project.
	 * @param id - ID of the project.
	 * @param dto - Updated project data.
	 * @param userId - Current user's ID.
	 * @returns Updated project details.
	 * @example
	 * PUT /user/organizations/projects/1
	 */
	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Permission('updateProject')
	async update(
		@Param('id') id: string,
		@Body() dto: ProjectDto,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.update({ id, dto, userId });
	}

	/**
	 * Changes the user's status in a project.
	 * @param id - ID of the project.
	 * @param dto - New status data.
	 * @param userId - Current user's ID.
	 * @returns Updated user status in the project.
	 * @example
	 * PUT /user/organizations/projects/1/update-status
	 */
	@UsePipes(new ValidationPipe())
	@Put(':id/update-status')
	@HttpCode(200)
	@Permission('manageUsers')
	async updateStatus(
		@Param('id') id: string,
		@Body() dto: ProjectStatusDto,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.updateStatus({ id, dto, userId });
	}

	/**
	 * Transfers the manager role to another user in a project.
	 * @param id - ID of the project.
	 * @param dto - Data for transferring the role.
	 * @param userId - Current user's ID.
	 * @returns Updated project details.
	 * @example
	 * PUT /user/organizations/projects/1/transfer-manager
	 */
	@UsePipes(new ValidationPipe())
	@Put(':id/transfer-manager')
	@HttpCode(200)
	@Permission('TransferManagerProject')
	async transferManagerRole(
		@Param('id') id: string,
		@Body() dto: TransferManagerDto,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.transferManagerRole({ id, dto, userId });
	}

	/**
	 * Exits the project for the current user.
	 * @param userId - Current user's ID.
	 * @param queryUserId - User ID from query (optional).
	 * @param id - ID of the project.
	 * @returns Confirmation of the exit.
	 * @example
	 * DELETE /user/organizations/projects/1/exit
	 */
	@Delete(':id/exit')
	@HttpCode(204)
	@Permission('viewResources')
	async exit(
		@CurrentUser('id') userId: string,
		@Param('id') id: string,
		@Query('userId') queryUserId: string
	) {
		return this.projectService.exit({ id, userId: queryUserId || userId });
	}

	/**
	 * Deletes a project.
	 * @param id - ID of the project to delete.
	 * @param userId - Current user's ID.
	 * @returns Confirmation of the deletion.
	 * @example
	 * DELETE /user/organizations/projects/1
	 */
	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(204)
	@Permission('deleteProject')
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.projectService.delete({ id, userId });
	}
}
