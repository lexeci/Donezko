// Importing types related to authenticated users, comments, teams, and more
import {AuthUser} from "./auth.types"; // Types related to authenticated users
import {CommentResponse} from "./comment.types"; // Types related to comments on tasks
import type {Project} from "./project.types"; // Type definition for Project (if available)
import type {RootBase} from "./root.types"; // Base type for common properties across different models
import {Team} from "./team.types"; // Types related to teams

// Enum for defining task priority levels
export enum EnumTaskPriority {
    LOW = "LOW", // Low priority task
    MEDIUM = "MEDIUM", // Medium priority task
    HIGH = "HIGH", // High priority task
}

/**
 * Enum for defining the task status.
 * This enum represents different stages of a task lifecycle.
 */
export enum EnumTaskStatus {
    NOT_STARTED = "NOT_STARTED", // Task has not started yet
    IN_PROGRESS = "IN_PROGRESS", // Task is currently being worked on
    COMPLETED = "COMPLETED", // Task has been completed
    ON_HOLD = "ON_HOLD", // Task is paused or delayed
}

/**
 * Interface for the response of a task.
 * Includes task title, description, priority, completion status, and related users.
 * @example
 * const task: TaskResponse = {
 *   title: "Finish project report",
 *   description: "Complete the final draft of the project report",
 *   isCompleted: false,
 *   priority: EnumTaskPriority.HIGH,
 *   _count: { comments: 0 }
 * };
 */
export interface TaskResponse extends RootBase {
    title: string; // The title of the task
    description: string; // A detailed description of the task
    priority?: EnumTaskPriority; // The priority of the task (optional)
    isCompleted: boolean; // Indicates if the task is completed or not
    userId?: string; // The ID of the user responsible for the task (optional)
    user?: AuthUser; // The user responsible for the task (if exists)
    author?: AuthUser; // The user who created the task (optional)
    projectId?: string; // The ID of the project the task belongs to (optional)
    project?: Project; // The project the task belongs to (if exists)
    teamId?: string; // The ID of the team the task belongs to (optional)
    team?: Team; // The team the task belongs to (if exists)
    taskStatus?: EnumTaskStatus; // The current status of the task (optional)
    comments?: CommentResponse[]; // The list of comments associated with the task (if any)
    organizationId?: string | null; // The organization the task belongs to (optional, can be null)
    _count: {
        comments: number; // The number of comments for this task
    }
}

/**
 * Type for creating or updating a task.
 * Excludes certain fields like id and updatedAt to prevent manual changes.
 * @example
 * const taskFormData: TaskFormData = {
 *   title: "Create a new user manual",
 *   description: "Write detailed instructions for the new feature",
 *   isCompleted: false,
 *   priority: EnumTaskPriority.MEDIUM
 * };
 */
export type TaskFormData = Partial<
    Omit<TaskResponse, "id" | "updatedAt" | "comments">
>;
