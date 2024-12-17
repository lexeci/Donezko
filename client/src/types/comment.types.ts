import { AuthUser } from "./auth.types";
import type { RootBase } from "./root.types";
import { TaskResponse } from "./task.types";

export interface CommentResponse extends RootBase {
	content: string; // Вміст коментаря
	userId: string; // Ідентифікатор користувача, який створив коментар
	user: AuthUser; // Користувач, який створив коментар
	taskId: string; // Ідентифікатор задачі, до якої належить коментар
	task: TaskResponse; // Задача, до якої належить коментар
}

export type CommentFormData = Partial<
	Omit<CommentResponse, "id" | "createdAt" | "updatedAt">
>;
