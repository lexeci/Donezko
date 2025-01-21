import { Auth } from '@/api/auth/decorators/auth.decorator';
import { CurrentUser } from '@/api/auth/decorators/user.decorator';
import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { Permission } from '../permission/decorators/permission.decorator';
import {
	ChangeTaskAssigneeDto,
	ChangeTaskTeamDto,
	CreateTaskDto,
	ManageTaskDto,
	TaskCommentDto,
	UpdateTaskDto
} from './dto/task.dto';
import { TaskService } from './task.service';

/**
 * Controller to handle task-related actions for users.
 * This controller contains endpoints for performing CRUD (Create, Read, Update, Delete) operations
 * on tasks and task comments. The actions include viewing, creating, updating, deleting tasks,
 * managing assignees, transferring tasks between teams, and adding or deleting comments.
 *
 * Each endpoint is protected by authentication and authorization checks, ensuring that users
 * can only access or modify tasks and comments they are permitted to interact with.
 *
 * @module UserController
 */
@Controller('user/tasks')
export class TaskController {
	/**
	 * Constructs a new instance of TaskController.
	 *
	 * @param TaskService The service responsible for task-related business logic.
	 */
	constructor(private readonly taskService: TaskService) {}

	/**
	 * Get all tasks for the current authenticated user.
	 * This endpoint retrieves a list of tasks that are assigned to the authenticated user.
	 * It allows filtering tasks by organization, project, team, and availability status.
	 *
	 * @param userId The ID of the authenticated user. This is automatically extracted from the authenticated user context.
	 * @param organizationId The ID of the organization to filter tasks by (optional).
	 * @param projectId The ID of the project to filter tasks by (optional).
	 * @param teamId The ID of the team to filter tasks by (optional).
	 * @param available A flag to filter tasks by their availability (optional, "true" or "false").
	 * @returns A list of all tasks assigned to the current user, optionally filtered by the provided query parameters.
	 *
	 * @example
	 * // Get all tasks for the current user in a specific organization, project, and team
	 * GET /user/tasks?organizationId=org1&projectId=project1&teamId=team1&available=true
	 * // Returns a list of tasks assigned to the user
	 */
	@Get()
	@Auth() // Authenticated access required
	@Permission('viewResources') // Permission required
	@HttpCode(200)
	async getAll(
		@CurrentUser('id') userId: string,
		@Query('organizationId') organizationId: string,
		@Query('projectId') projectId: string,
		@Query('teamId') teamId: string,
		@Query('available') available: string
	) {
		return this.taskService.getAll({
			organizationId,
			userId,
			projectId,
			teamId,
			available
		});
	}

	/**
	 * Create a new task for a user.
	 * This endpoint allows the authenticated user to create a new task, ensuring that the necessary data
	 * (organization, project, and team) is provided before the task is created.
	 *
	 * @param dto The task data, including required information such as the task's title, description,
	 * projectId, teamId, and organizationId.
	 * @param userId The ID of the authenticated user, which is extracted from the user's session or token.
	 * @returns The created task data with its ID, title, description, and related details.
	 *
	 * @throws ForbiddenException if any of the required fields (organization, project, or team) are missing.
	 *
	 * @example
	 * // Create a new task for the current user in a specific organization, project, and team
	 * POST /user/tasks
	 * Request body:
	 * {
	 *   "title": "New Task",
	 *   "description": "Task description",
	 *   "organizationId": "org1",
	 *   "projectId": "project1",
	 *   "teamId": "team1"
	 * }
	 * // Returns the created task data:
	 * {
	 *   "id": "task1",
	 *   "title": "New Task",
	 *   "description": "Task description",
	 *   "projectId": "project1",
	 *   "teamId": "team1",
	 *   "organizationId": "org1"
	 * }
	 */
	@Post()
	@UsePipes(new ValidationPipe()) // Validation for incoming data
	@Auth() // Authenticated access required
	@Permission('editResources') // Permission required
	@HttpCode(201) // Created status code
	async create(@Body() dto: CreateTaskDto, @CurrentUser('id') userId: string) {
		const { organizationId, projectId, teamId } = dto;

		if (!organizationId) {
			throw new ForbiddenException('Organization was not selected');
		}

		if (!projectId) {
			throw new ForbiddenException('Project was not selected');
		}

		if (!teamId) {
			throw new ForbiddenException('Team was not selected');
		}

		return this.taskService.create({ dto, userId });
	}

	/**
	 * Update an existing task.
	 * This endpoint allows the authenticated user to update an existing task. It takes in the task's ID
	 * and the new data to modify, and it returns the updated task data.
	 *
	 * @param id The ID of the task to update. This is a unique identifier for the task that needs to be updated.
	 * @param dto The new task data, which may include any fields of the task that need to be updated (e.g., title, description).
	 * @param userId The ID of the authenticated user, which is extracted from the user's session or token.
	 * @returns The updated task data, including the task's new title, description, and other details.
	 *
	 * @throws ForbiddenException if the user does not have permission to edit the task.
	 *
	 * @example
	 * // Update an existing task with new details
	 * PUT /user/tasks/:id
	 * Request body:
	 * {
	 *   "title": "Updated Task Title",
	 *   "description": "Updated task description"
	 * }
	 * // Returns the updated task data:
	 * {
	 *   "id": "task1",
	 *   "title": "Updated Task Title",
	 *   "description": "Updated task description",
	 *   "projectId": "project1",
	 *   "teamId": "team1",
	 *   "organizationId": "org1"
	 * }
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
	 * This endpoint allows the authenticated user to delete a task by its ID. The task will be permanently removed,
	 * and a confirmation response is returned.
	 *
	 * @param id The ID of the task to delete. This is a unique identifier for the task that needs to be deleted.
	 * @param dto Additional data for managing the task deletion, such as user information.
	 * @param userId The ID of the authenticated user, which is extracted from the user's session or token.
	 * @returns A confirmation of the task deletion with HTTP status 204 (No content), indicating that the task was successfully deleted.
	 *
	 * @throws ForbiddenException if the user does not have permission to delete the task.
	 *
	 * @example
	 * // Delete a task by its ID
	 * DELETE /user/tasks/:id
	 * Request body:
	 * {
	 *   "reason": "Task no longer needed"
	 * }
	 * // Returns a 204 status code with no content indicating successful deletion.
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
	 * Change the assignee of a task.
	 * This endpoint allows the authenticated user to reassign a task to another user. The task's assignee
	 * is updated, and the updated task data is returned with the new assignee.
	 *
	 * @param id The ID of the task whose assignee is to be changed.
	 * @param dto The new assignee data, including the ID of the user to be assigned to the task.
	 * @param userId The ID of the authenticated user, who is making the change request.
	 * @returns The updated task data with the new assignee, including details of the updated task.
	 *
	 * @throws ForbiddenException if the user does not have permission to change the task's assignee.
	 *
	 * @example
	 * // Change the assignee of a task
	 * PATCH /user/tasks/:id/assignee
	 * Request body:
	 * {
	 *   "newAssigneeId": "user123"
	 * }
	 * // Returns the updated task with the new assignee.
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
	 * This endpoint allows the authenticated user to transfer a task to a different team. The task's
	 * team assignment is updated, and the updated task data with the new team assignment is returned.
	 *
	 * @param id The ID of the task to transfer.
	 * @param dto The new team transfer data, including the ID of the team to transfer the task to.
	 * @param userId The ID of the authenticated user who is initiating the transfer.
	 * @returns The updated task with the new team assignment, including details of the transferred task.
	 *
	 * @throws ForbiddenException if the user does not have permission to transfer the task.
	 *
	 * @example
	 * // Transfer a task to a new team
	 * PATCH /user/tasks/:id/transfer
	 * Request body:
	 * {
	 *   "newTeamId": "team456"
	 * }
	 * // Returns the updated task with the new team assignment.
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
	 * This endpoint allows the authenticated user to add a comment to a specific task. The comment is
	 * created and associated with the task, and the newly added comment is returned.
	 *
	 * @param id The ID of the task to add the comment to.
	 * @param dto The comment data, including the content of the comment.
	 * @param userId The ID of the authenticated user who is adding the comment.
	 * @returns The newly added comment associated with the specified task.
	 *
	 * @throws ForbiddenException if the user does not have permission to add the comment.
	 *
	 * @example
	 * // Add a comment to a task
	 * POST /user/tasks/:id/comments
	 * Request body:
	 * {
	 *   "content": "This task is progressing well."
	 * }
	 * // Returns the newly added comment:
	 * {
	 *   "id": "comment123",
	 *   "taskId": "task456",
	 *   "userId": "user789",
	 *   "content": "This task is progressing well.",
	 *   "createdAt": "2025-01-15T00:00:00Z"
	 * }
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
	 * This endpoint retrieves all the comments associated with a specific task.
	 * The comments are returned as a list, allowing the user to view the history of comments on the task.
	 *
	 * @param id The ID of the task for which comments are being retrieved.
	 * @param organizationId The ID of the organization associated with the task.
	 * @param userId The ID of the authenticated user making the request.
	 * @returns A list of comments for the specified task.
	 *
	 * @throws ForbiddenException if the user does not have permission to view the comments.
	 *
	 * @example
	 * // Get all comments for a task
	 * GET /user/tasks/:id/comments?organizationId=org123
	 * // Returns a list of comments:
	 * [
	 *   {
	 *     "id": "comment123",
	 *     "taskId": "task456",
	 *     "userId": "user789",
	 *     "content": "This task is progressing well.",
	 *     "createdAt": "2025-01-15T00:00:00Z"
	 *   },
	 *   {
	 *     "id": "comment124",
	 *     "taskId": "task456",
	 *     "userId": "user790",
	 *     "content": "Let's discuss the blockers in the next meeting.",
	 *     "createdAt": "2025-01-16T00:00:00Z"
	 *   }
	 * ]
	 */
	@Get(':id/comments')
	@Auth() // Authenticated access required
	@Permission('viewResources') // Permission required
	@HttpCode(200)
	async getComments(
		@Param('id') id: string,
		@Query('organizationId') organizationId: string,
		@CurrentUser('id') userId: string
	) {
		return this.taskService.getCommentsForTask({ id, organizationId, userId });
	}

	/**
	 * Delete a comment from a task.
	 * This endpoint allows the authenticated user to delete a comment from a specified task.
	 * If the deletion is successful, it returns a 204 No Content status with no further details.
	 *
	 * @param id The ID of the task from which the comment is being deleted.
	 * @param commentId The ID of the comment to delete.
	 * @param organizationId The ID of the organization associated with the task.
	 * @param userId The ID of the authenticated user making the request.
	 * @returns Confirmation of the comment deletion with a 204 No Content response.
	 *
	 * @throws ForbiddenException if the user does not have permission to delete the comment.
	 *
	 * @example
	 * // Delete a comment from a task
	 * DELETE /user/tasks/:id/comments/:commentId?organizationId=org123
	 * // Returns a 204 No Content status if the deletion is successful.
	 */
	@Delete(':id/comments/:commentId')
	@Auth() // Authenticated access required
	@Permission('editResources') // Permission required
	@HttpCode(204) // No content status code for successful deletion
	async deleteComment(
		@Param('id') id: string,
		@Param('commentId') commentId: string,
		@Query('organizationId') organizationId: string,
		@CurrentUser('id') userId: string
	) {
		await this.taskService.deleteComment({
			id,
			commentId,
			organizationId,
			userId
		});
	}
}
