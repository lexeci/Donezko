import {axiosWithAuth} from "@/api/interceptors";
import {toast} from "sonner";
import {CommentFormData, CommentResponse} from "@/types/comment.types";

class CommentsService {
    private BASE_URL = "/user/tasks";

    async getAllComments(taskId: string, organizationId: string): Promise<CommentResponse[] | undefined> {
        try {
            const response = await axiosWithAuth.get<CommentResponse[] | undefined>(`${this.BASE_URL}/${taskId}/comments?organizationId=${organizationId}`);
            return response.data;
        } catch (error: any) {
            error && toast.error(error.response.data.message);
            console.error(`Fetching comments error:`, error);
            throw new Error(`Fetching comments failed`);
        }
    }

    async createComment(taskId: string, data: CommentFormData): Promise<CommentResponse | undefined> {
        try {
            const response = await axiosWithAuth.post<CommentResponse | undefined>(`${this.BASE_URL}/${taskId}/comments`, data);
            return response.data;
        } catch (error: any) {
            error && toast.error(error.response.data.message);
            console.error(`Fetching comments error:`, error);
            throw new Error(`Fetching comments failed`);
        }
    }

    async deleteComment({taskId, id, organizationId}: {
        taskId: string,
        id: string,
        organizationId: string
    }): Promise<CommentResponse | undefined> {
        try {
            const response = await axiosWithAuth.delete<CommentResponse | undefined>(`${this.BASE_URL}/${taskId}/comments/${id}?organizationId=${organizationId}`)
            return response.data;
        } catch (error: any) {
            error && toast.error(error.response.data.message);
            console.error(`Fetching comments error:`, error);
            throw new Error(`Fetching comments failed`);
        }
    }
}

export const commentsService = new CommentsService();
