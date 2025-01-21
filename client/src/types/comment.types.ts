import {AuthUser} from "./auth.types";
import type {RootBase} from "./root.types";
import {TaskResponse} from "./task.types";

/**
 * Interface representing a comment associated with a task.
 * Contains the content, user information, task details, and relevant metadata.
 */
export interface CommentResponse extends RootBase {
    content: string; // The content of the comment (text written by the user)
    userId: string; // The ID of the user who created the comment
    user: AuthUser; // The user who created the comment (includes user details)
    taskId: string; // The ID of the task the comment is associated with
    task: TaskResponse; // The task the comment is associated with (includes task details)
}

/**
 * Type for form data when creating or updating a comment.
 * Excludes certain fields like `id`, `createdAt`, and `updatedAt`.
 * The `organizationId` is optional and can be set to null.
 */
export type CommentFormData = Partial<
    Omit<CommentResponse, "id" | "createdAt" | "updatedAt"> & { organizationId: string | null }
>;

