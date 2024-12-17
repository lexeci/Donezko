import type { RootBase } from "./root.types";

export enum EnumTaskPriority {
	low = "low",
	medium = "medium",
	high = "high",
}

export interface TaskResponse extends RootBase {
	title: string;
	description: string;
	priority?: EnumTaskPriority;
	isCompleted: boolean;
}

export type TypeTaskFormState = Partial<Omit<TaskResponse, "id" | "updatedAt">>;
