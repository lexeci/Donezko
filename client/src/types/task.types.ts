import type { RootBase } from "./root.types";

export enum EnumTaskPriority {
	low = "low",
	medium = "medium",
	high = "high",
}

export interface TaskResponse extends RootBase {
	title: string; // Title of the task
	description: string; // Description of the task
	priority?: EnumTaskPriority; // Optional priority of the task
	isCompleted: boolean; // Indicates if the task is completed
}

export type TaskFormData = Partial<Omit<TaskResponse, "id" | "updatedAt">>;
