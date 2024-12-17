import { Auth } from '@/api/auth/decorators/auth.decorator';
import { CurrentUser } from '@/api/auth/decorators/user.decorator';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { Permission } from '../permission/decorators/permission.decorator';
import {
	ChangeTaskAssigneeDto,
	ChangeTaskTeamDto,
	CreateTaskDto,
	GetProjectTaskDto,
	GetTaskCommentDto,
	GetTeamTaskDto,
	ManageTaskDto,
	TaskCommentDto,
	UpdateTaskDto
} from './dto/task.dto';
import { TaskService } from './task.service';

/**
 * Controller to handle task-related actions for users.
 * Contains endpoints for viewing, creating, updating, deleting tasks and task comments.
 */
@Controller('user/tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	/**
	 * Get all tasks for the current authenticated user.
	 *
	 * @param userId The ID of the authenticated user.
	 * @returns A list of all tasks assigned to the current user.
	 */
	@Get()
	@Auth() // Authenticated access required
	@Permission('viewResources') // Permission required
	@HttpCode(200)
	async getAll(@CurrentUser('id') userId: string) {
		return this.taskService.getAll(userId);
	}

	/**
	 * Create a new task for a user.
	 *
	 * @param dto The task data.
	 * @param userId The ID of the authenticated user.
	 * @returns The created task data.
	 */
	@Post()
	@UsePipes(new ValidationPipe()) // Validation for incoming data
	@Auth() // Authenticated access required
	@Permission('editResources') // Permission required
	@HttpCode(201) // Created status code
	async create(@Body() dto: CreateTaskDto, @CurrentUser('id') userId: string) {
		return this.taskService.create({ dto, userId });
	}

	/**
	 * Update an existing task.
	 *
	 * @param id The ID of the task to update.
	 * @param dto The new task data.
	 * @param userId The ID of the authenticated user.
	 * @returns The updated task data.
	 */
	@Put(':id')
	@UsePipes(new ValidationPipe()) // Validation for incoming data
	@Auth() // Authenticated access required
	@Permission('editResources') // Permission required
	@HttpCode(200)
	async update(
		@Param('id') id: string,
		@Body() dto: Partial<UpdateTaskDto>,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.update({ dto, id, userId });
	}

	/**
	 * Delete a task by its ID.
	 *
	 * @param id The ID of the task to delete.
	 * @param dto Additional data for managing the task (e.g., user).
	 * @param userId The ID of the authenticated user.
	 * @returns A confirmation of the task deletion.
	 */
	@Delete(':id')
	@Auth() // Authenticated access required
	@Permission('editResources') // Permission required
	@HttpCode(204) // No content status code for successful deletion
	async delete(
		@Param('id') id: string,
		@Body() dto: ManageTaskDto,
		@CurrentUser('id') userId: string
	) {
		await this.taskService.delete({ id, dto, userId });
	}

	/**
	 * Get all tasks for a specific project.
	 *
	 * @param id The ID of the project.
	 * @param dto Additional data (e.g., organization).
	 * @param userId The ID of the authenticated user.
	 * @returns A list of tasks for the specified project.
	 */
	@Get('project/:id')
	@Auth() // Authenticated access required
	@Permission('viewResources') // Permission required
	@HttpCode(200)
	async getAllForProject(
		@Param('id') id: string,
		@Body() dto: GetProjectTaskDto,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.getAllForProject({ id, dto, userId });
	}

	/**
	 * Get all tasks for a specific team.
	 *
	 * @param id The ID of the team.
	 * @param dto Additional data (e.g., organization).
	 * @param userId The ID of the authenticated user.
	 * @returns A list of tasks for the specified team.
	 */
	@Get('team/:id')
	@Auth() // Authenticated access required
	@Permission('viewResources') // Permission required
	@HttpCode(200)
	async getAllForTeam(
		@Param('id') id: string,
		@Body() dto: GetTeamTaskDto,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.getAllForTeam({ id, dto, userId });
	}

	/**
	 * Change the assignee of a task.
	 *
	 * @param id The ID of the task.
	 * @param dto The new assignee data.
	 * @param userId The ID of the authenticated user.
	 * @returns The updated task data with new assignee.
	 */
	@Patch(':id/assignee')
	@UsePipes(new ValidationPipe()) // Validation for incoming data
	@Auth() // Authenticated access required
	@Permission('editResources') // Permission required
	@HttpCode(200)
	async changeAssignee(
		@Param('id') id: string,
		@Body() dto: ChangeTaskAssigneeDto,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.changeAssignee({ id, dto, userId });
	}

	/**
	 * Transfer a task to another team.
	 *
	 * @param id The ID of the task.
	 * @param dto The new team transfer data.
	 * @param userId The ID of the authenticated user.
	 * @returns The updated task with the new team.
	 */
	@Patch(':id/transfer')
	@UsePipes(new ValidationPipe()) // Validation for incoming data
	@Auth() // Authenticated access required
	@Permission('editResources') // Permission required
	@HttpCode(200)
	async transferTaskToTeam(
		@Param('id') id: string,
		@Body() dto: ChangeTaskTeamDto,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.transferTaskToTeam({ id, dto, userId });
	}

	/**
	 * Add a comment to a task.
	 *
	 * @param id The ID of the task.
	 * @param dto The comment data.
	 * @param userId The ID of the authenticated user.
	 * @returns The newly added comment.
	 */
	@Post(':id/comments')
	@UsePipes(new ValidationPipe()) // Validation for incoming data
	@Auth() // Authenticated access required
	@Permission('editResources') // Permission required
	@HttpCode(201) // Created status code
	async addComment(
		@Param('id') id: string,
		@Body() dto: TaskCommentDto,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.addCommentToTask({ id, userId, dto });
	}

	/**
	 * Get all comments for a task.
	 *
	 * @param id The ID of the task.
	 * @param dto Additional data (e.g., organization).
	 * @param userId The ID of the authenticated user.
	 * @returns A list of comments for the specified task.
	 */
	@Get(':id/comments')
	@Auth() // Authenticated access required
	@Permission('viewResources') // Permission required
	@HttpCode(200)
	async getComments(
		@Param('id') id: string,
		@Body() dto: GetTaskCommentDto,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.getCommentsForTask({ id, dto, userId });
	}

	/**
	 * Delete a comment from a task.
	 *
	 * @param id The ID of the task.
	 * @param commentId The ID of the comment to delete.
	 * @param dto Additional data (e.g., organization).
	 * @param userId The ID of the authenticated user.
	 * @returns Confirmation of the comment deletion.
	 */
	@Delete(':id/comments/:commentId')
	@Auth() // Authenticated access required
	@Permission('editResources') // Permission required
	@HttpCode(204) // No content status code for successful deletion
	async deleteComment(
		@Param('id') id: string,
		@Param('commentId') commentId: string,
		@Body() dto: GetTaskCommentDto,
		@CurrentUser('id') userId: string
	) {
		await this.taskService.deleteComment({ id, commentId, dto, userId });
	}
}
