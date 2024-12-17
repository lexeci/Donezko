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
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@Controller('user/organizations/projects')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	// Get all active projects for a user, either from all organizations or a specific organization
	@UsePipes(new ValidationPipe())
	@Get()
	@HttpCode(200)
	@Permission('viewResources') // Custom permission decorator to check access rights
	async getAll(@Body() dto: ProjectDto, @CurrentUser('id') userId: string) {
		return dto.organizationId
			? this.projectService.getAll(userId) // Get projects from a specific organization
			: this.projectService.getAllFromOrg(userId, dto.organizationId); // Get all active projects from the organization
	}

	// Create a new project
	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Permission('createProject') // Custom permission decorator to check access rights
	async create(@Body() dto: ProjectDto, @CurrentUser('id') userId: string) {
		return this.projectService.create(dto, userId); // Create the project
	}

	// Add new member of project
	@UsePipes(new ValidationPipe())
	@Post('/add-user/:id/')
	@HttpCode(200)
	@Permission('manageUsers') // Custom permission decorator to check access rights
	async addUser(
		@Body() dto: ProjectDto,
		@CurrentUser('id') userId: string,
		@Param('id') projectId: string
	) {
		return this.projectService.addUser(projectId, userId, dto.userId); // Add user to project
	}

	// Change the user's status in a project (Active, Banned, etc.)
	@UsePipes(new ValidationPipe())
	@Put('/update-status/:id/')
	@HttpCode(200)
	@Permission('manageUsers') // Custom permission to ensure only authorized users can change status
	async updateStatus(
		@Body() dto: ProjectDto, // This dto should contain the new status and organizationId for validation
		@CurrentUser('id') userId: string,
		@Param('id') projectId: string
	) {
		return this.projectService.updateStatus(
			projectId,
			userId,
			dto.userId,
			dto.projectStatus
		);
	}

	// Update an existing project
	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Permission('updateProject') // Custom permission to check if the user has rights to edit this project
	async update(
		@Param('id') projectId: string,
		@Body() dto: ProjectDto,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.update(projectId, dto, userId); // Update project details
	}

	// Додати цей метод до ProjectController
	@Delete('/exit/:id')
	@HttpCode(200)
	@Permission('viewResources') // Custom permission to ensure only authorized users can leave
	async exit(
		@CurrentUser('id') userId: string,
		@Param('id') projectId: string
	) {
		return this.projectService.exit(userId, projectId); // Виклик методу leaveProject у сервісі
	}

	// Delete a project
	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Permission('deleteProject') // Custom permission to check if the user can delete this project
	async delete(
		@Param('id') projectId: string,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.delete(projectId, userId); // Delete the project
	}
}
