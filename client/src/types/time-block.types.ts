import type { RootBase } from "./root.types";

export interface TimeBlockResponse extends RootBase {
	title: string;
	color?: string;
	duration: number;
	order: number;
}

export type TypeTimeBlockFormState = Partial<
	Omit<TimeBlockResponse, "createdAt" | "updatedAt">
>;
