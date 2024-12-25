import { AuthUser } from "./auth.types";
import { CommentResponse } from "./comment.types";
import type { Project } from "./project.types"; // Якщо є тип для Project
import type { RootBase } from "./root.types";
import type { TeamResponse } from "./team.types"; // Якщо є тип для Team

export enum EnumTaskPriority {
	low = "low",
	medium = "medium",
	high = "high",
}

export interface TaskResponse extends RootBase {
	title: string; // Назва задачі
	description: string; // Опис задачі
	priority?: EnumTaskPriority; // Пріоритет задачі (не обов'язково)
	isCompleted: boolean; // Статус виконання задачі
	userId?: string; // Ідентифікатор користувача, відповідального за задачу
	user?: AuthUser; // Користувач, відповідальний за задачу (якщо є)
	projectId?: string; // Ідентифікатор проекту, до якого належить задача
	project?: Project; // Проект, до якого належить задача (якщо є)
	teamId?: string; // Ідентифікатор команди, до якої належить задача
	team?: TeamResponse; // Команда, до якої належить задача (якщо є)
	comments?: CommentResponse[]; // Коментарі до задачі
}

export type TaskFormData = Partial<
	Omit<TaskResponse, "id" | "updatedAt" | "comments">
>;
