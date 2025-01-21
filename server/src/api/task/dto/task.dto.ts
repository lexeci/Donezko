import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * CreateTaskDto - Data Transfer Object for creating a new task.
 *
 * This class defines the structure for creating a task within an organization, project, and team.
 * It validates the required fields, including organization, project, and team IDs, as well as task title and description.
 */
export class CreateTaskDto {
	/**
	 * The ID of the organization where the task is created.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization ID
	 */
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	/**
	 * The ID of the project where the task belongs.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "projectId": "proj456" }
	 * // Represents the project ID
	 */
	@IsString()
	@IsNotEmpty()
	projectId: string;

	/**
	 * (Optional) The ID of the user assigned to the task.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "userId": "user789" }
	 * // Represents the assigned user's ID
	 */
	@IsString()
	@IsOptional()
	userId: string;

	/**
	 * The ID of the team responsible for the task.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "teamId": "team321" }
	 * // Represents the team ID
	 */
	@IsString()
	@IsNotEmpty()
	teamId: string;

	/**
	 * The title of the task.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "title": "Fix Bug #123" }
	 * // Represents the task title
	 */
	@IsString()
	@IsNotEmpty()
	title: string;

	/**
	 * The description of the task.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "description": "Fix the reported bug in the login module" }
	 * // Represents the task description
	 */
	@IsString()
	@IsNotEmpty()
	description: string;
}

/**
 * UpdateTaskDto - Data Transfer Object for updating an existing task.
 *
 * This class defines the structure for updating a task's details, such as title, description, and status.
 */
export class UpdateTaskDto {
	/**
	 * The ID of the organization where the task is updated.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization ID
	 */
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	/**
	 * The ID of the project where the task is located.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "projectId": "proj456" }
	 * // Represents the project ID
	 */
	@IsString()
	@IsNotEmpty()
	projectId: string;

	/**
	 * The ID of the team where the task resides.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "teamId": "team321" }
	 * // Represents the team ID
	 */
	@IsString()
	@IsNotEmpty()
	teamId: string;

	/**
	 * (Optional) The updated title of the task.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "title": "Update Feature #123" }
	 * // Represents the new task title
	 */
	@IsString()
	@IsOptional()
	title: string;

	/**
	 * (Optional) The updated description of the task.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "description": "Add new features to the dashboard" }
	 * // Represents the new task description
	 */
	@IsString()
	@IsOptional()
	description: string;

	/**
	 * (Optional) Indicates if the task is completed.
	 *
	 * @type {boolean}
	 * @optional
	 *
	 * @example
	 * { "isCompleted": true }
	 * // Represents the completion status of the task
	 */
	@IsBoolean()
	@IsOptional()
	isCompleted: boolean;
}

/**
 * ManageTaskDto - Data Transfer Object for managing tasks (assigning/removing a user).
 *
 * This class defines the structure for assigning or removing a user from a task within an organization, project, and team.
 */
export class ManageTaskDto {
	/**
	 * The ID of the organization where the task is managed.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization ID
	 */
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	/**
	 * The ID of the project where the task is managed.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "projectId": "proj456" }
	 * // Represents the project ID
	 */
	@IsString()
	@IsNotEmpty()
	projectId: string;

	/**
	 * The ID of the team where the task is managed.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "teamId": "team321" }
	 * // Represents the team ID
	 */
	@IsString()
	@IsNotEmpty()
	teamId: string;

	/**
	 * (Optional) The ID of the user to add or remove from the task.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "taskUserId": "user789" }
	 * // Represents the user to be added or removed from the task
	 */
	@IsOptional()
	@IsString()
	taskUserId: string;
}

/**
 * ChangeTaskAssigneeDto - Data Transfer Object for changing the assignee of a task.
 *
 * This class defines the structure for transferring the task assignment from one user to another.
 */
export class ChangeTaskAssigneeDto {
	/**
	 * The ID of the organization where the task is reassigned.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization ID
	 */
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	/**
	 * The ID of the new user to be assigned the task.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "taskUserId": "user789" }
	 * // Represents the new assignee's user ID
	 */
	@IsString()
	@IsNotEmpty()
	taskUserId: string;
}

/**
 * ChangeTaskTeamDto - Data Transfer Object for transferring a task to a different team.
 *
 * This class defines the structure for moving a task from one team to another within the same organization and project.
 */
export class ChangeTaskTeamDto {
	/**
	 * The ID of the organization where the task is transferred.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization ID
	 */
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	/**
	 * The ID of the new team to which the task is transferred.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "teamId": "team321" }
	 * // Represents the new team ID
	 */
	@IsString()
	@IsNotEmpty()
	teamId: string;
}

/**
 * TaskCommentDto - Data Transfer Object for adding a comment to a task.
 *
 * This class defines the structure for adding a comment to an existing task.
 */
export class TaskCommentDto {
	/**
	 * The ID of the organization where the task comment is added.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization ID
	 */
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	/**
	 * The content of the task comment.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "content": "This task needs to be completed by the end of the week." }
	 * // Represents the content of the task comment
	 */
	@IsString()
	@IsNotEmpty()
	content: string;
}
