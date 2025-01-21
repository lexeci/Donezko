import {axiosWithAuth} from "@/api/interceptors"; // Axios instance with authentication
import {toast} from "sonner"; // Toast notifications library
import {CommentFormData, CommentResponse} from "@/types/comment.types"; // Types for comment form and response

/**
 * @class CommentsService
 *
 * Service for managing comments related to tasks. It provides methods to fetch, create, and delete comments
 * associated with tasks within a specified organization.
 *
 * Methods:
 * - `getAllComments`: Fetches all comments for a given task and organization.
 * - `createComment`: Creates a new comment for a given task.
 * - `deleteComment`: Deletes a specific comment from a task.
 *
 * Error handling is included with appropriate toast notifications and error logging.
 *
 * Example usage:
 * @example
 * const comments = await commentsService.getAllComments("task123", "org123");
 * const newComment = await commentsService.createComment("task123", { content: "This is a new comment" });
 * const deletedComment = await commentsService.deleteComment({ taskId: "task123", id: "comment456", organizationId: "org123" });
 */
class CommentsService {
    private BASE_URL = "/user/tasks"; // Base URL for the comments API

    /**
     * Fetches all comments for a specific task within an organization.
     * @param taskId - The ID of the task for which to fetch comments
     * @param organizationId - The ID of the organization to filter comments
     * @returns {Promise<CommentResponse[] | undefined>} - List of comments or undefined if no comments
     * @throws {Error} - If an error occurs while fetching the comments
     * @example
     * const comments = await commentsService.getAllComments("task123", "org123");
     */
    async getAllComments(
        taskId: string, // Task ID for which comments are being fetched
        organizationId: string // Organization ID to filter comments by
    ): Promise<CommentResponse[] | undefined> {
        try {
            const response = await axiosWithAuth.get<CommentResponse[] | undefined>(
                `${this.BASE_URL}/${taskId}/comments?organizationId=${organizationId}`
            );
            return response.data;
        } catch (error: any) {
            error && toast.error(error.response.data.message); // Display error message
            console.error(`Fetching comments error:`, error);
            throw new Error(`Fetching comments failed`); // Throw error if fetching fails
        }
    }

    /**
     * Creates a new comment for a specific task.
     * @param taskId - The ID of the task for which the comment is being created
     * @param data - The data of the comment to be created
     * @returns {Promise<CommentResponse | undefined>} - The created comment or undefined if failed
     * @throws {Error} - If an error occurs while creating the comment
     * @example
     * const newComment = await commentsService.createComment("task123", { content: "This is a new comment" });
     */
    async createComment(
        taskId: string, // Task ID for which the comment is being created
        data: CommentFormData // Data for the new comment
    ): Promise<CommentResponse | undefined> {
        try {
            const response = await axiosWithAuth.post<CommentResponse | undefined>(
                `${this.BASE_URL}/${taskId}/comments`, data
            );
            return response.data;
        } catch (error: any) {
            error && toast.error(error.response.data.message); // Display error message
            console.error(`Fetching comments error:`, error);
            throw new Error(`Fetching comments failed`); // Throw error if creation fails
        }
    }

    /**
     * Deletes a specific comment from a task.
     * @param taskId - The ID of the task from which the comment is being deleted
     * @param id - The ID of the comment to be deleted
     * @param organizationId - The ID of the organization to filter the comment by
     * @returns {Promise<CommentResponse | undefined>} - The deleted comment or undefined if failed
     * @throws {Error} - If an error occurs while deleting the comment
     * @example
     * const deletedComment = await commentsService.deleteComment({ taskId: "task123", id: "comment456", organizationId: "org123" });
     */
    async deleteComment({
                            taskId,
                            id,
                            organizationId,
                        }: {
        taskId: string, // Task ID from which the comment is being deleted
        id: string, // Comment ID to be deleted
        organizationId: string // Organization ID to filter the comment by
    }): Promise<CommentResponse | undefined> {
        try {
            const response = await axiosWithAuth.delete<CommentResponse | undefined>(
                `${this.BASE_URL}/${taskId}/comments/${id}?organizationId=${organizationId}`
            );
            return response.data;
        } catch (error: any) {
            error && toast.error(error.response.data.message); // Display error message
            console.error(`Fetching comments error:`, error);
            throw new Error(`Fetching comments failed`); // Throw error if deletion fails
        }
    }
}

// Exporting an instance of the service for external usage
export const commentsService = new CommentsService();
