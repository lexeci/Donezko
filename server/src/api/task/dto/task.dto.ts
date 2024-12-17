import { Priority } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator';

/**
 * DTO for creating a new task.
 */
export class CreateTaskDto {
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	@IsString()
	@IsNotEmpty()
	projectId: string;

	@IsString()
	@IsNotEmpty()
	teamId: string;

	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	description: string;
}

/**
 * DTO for updating an existing task.
 */
export class UpdateTaskDto {
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	@IsString()
	@IsNotEmpty()
	projectId: string;

	@IsString()
	@IsNotEmpty()
	teamId: string;

	@IsString()
	@IsOptional()
	title: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsBoolean()
	@IsOptional()
	isCompleted: boolean;
}

/**
 * DTO for managing tasks (assigning/removing a user).
 */
export class ManageTaskDto {
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	@IsString()
	@IsNotEmpty()
	projectId: string;

	@IsString()
	@IsNotEmpty()
	teamId: string;

	@IsOptional()
	@IsString()
	taskUserId: string; // The ID of the user to add or remove from the team.
}

/**
 * DTO for retrieving tasks by team.
 */
export class GetTeamTaskDto {
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	@IsString()
	@IsNotEmpty()
	projectId: string;
}

/**
 * DTO for retrieving tasks by project.
 */
export class GetProjectTaskDto {
	@IsString()
	@IsNotEmpty()
	organizationId: string;
}

/**
 * DTO for changing the assignee of a task.
 */
export class ChangeTaskAssigneeDto {
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	@IsString()
	@IsNotEmpty()
	taskUserId: string;
}

/**
 * DTO for transferring a task to a different team.
 */
export class ChangeTaskTeamDto {
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	@IsString()
	@IsNotEmpty()
	teamId: string;
}

/**
 * DTO for adding a comment to a task.
 */
export class TaskCommentDto {
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	@IsString()
	@IsNotEmpty()
	content: string;
}

/**
 * DTO for retrieving comments of a task.
 */
export class GetTaskCommentDto {
	@IsString()
	@IsNotEmpty()
	organizationId: string;
}

/**
 * DTO for representing a task with optional properties.
 */
export class TaskDto {
	@IsString()
	@IsOptional()
	organizationId: string;

	@IsString()
	@IsOptional()
	teamId: string;

	@IsString()
	@IsOptional()
	projectId: string;

	@IsString()
	@IsOptional()
	title: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsBoolean()
	@IsOptional()
	isCompleted: boolean;

	@IsString()
	@IsOptional()
	createdAt: string;

	@IsEnum(Priority)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toLowerCase())
	priority: Priority;

	@IsString()
	@IsOptional()
	newAssigneeId: string;

	@IsString()
	@IsOptional()
	content: string;
}
