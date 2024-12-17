import type { RootBase } from "./root.types";
import { ColorsType } from "@/constants/colors.constants";

// Interface representing the response for a time block
export interface TimeBlockResponse extends RootBase {
	title: string; // Title of the time block
	color?: ColorsType; // Optional color for the time block, using enum
	duration: number; // Duration of the time block (in minutes)
	order: number; // Order of the time block for sorting
}

// Type for creating or updating time block data
export type TimeBlockFormValues = Partial<
	Omit<TimeBlockResponse, "createdAt" | "updatedAt">
>;
