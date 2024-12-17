import type { RootBase } from "./root.types";

export interface TimerRoundResponse extends RootBase {
	isCompleted?: boolean;
	totalSeconds: number;
}

export interface TimerSessionResponse extends RootBase {
	isCompleted?: boolean;
	rounds?: TimerRoundResponse[];
}

export type TypeTimerSessionState = Partial<
	Omit<TimerSessionResponse, "id" | "createdAt" | "updatedAt">
>;

export type TypeTimerRoundState = Partial<
	Omit<TimerRoundResponse, "id" | "createdAt" | "updatedAt">
>;
