import type { RootBase } from "./root.types"; // Base type definition for common properties
import type { Dispatch, SetStateAction } from "react"; // Type definitions for React state management

// Enum representing possible states for a timer round
export enum TimerRoundStatus {
	NOT_STARTED = "not_started",
	RUNNING = "running",
	COMPLETED = "completed",
}

// Interface representing a timer round
export interface TimerRoundResponse extends RootBase {
	isCompleted?: boolean; // Optional flag indicating if the round is completed
	totalSeconds: number; // Total seconds allocated for this round
	status?: TimerRoundStatus; // Optional status for the round
}

// Interface representing a timer session
export interface TimerSessionResponse extends RootBase {
	isCompleted?: boolean; // Optional flag indicating if the session is completed
	rounds?: TimerRoundResponse[]; // Optional array of rounds associated with this session
}

// Type for partial state of a timer session
export type TypeTimerSessionState = Partial<
	Omit<TimerSessionResponse, "id" | "createdAt" | "updatedAt">
>;

// Type for partial state of a timer round
export type TypeTimerRoundState = Partial<
	Omit<TimerRoundResponse, "id" | "createdAt" | "updatedAt">
>;

// Interface for managing the timer state
export interface TimerState {
	isRunning: boolean; // Indicates if the timer is currently running
	secondsLeft: number; // Seconds remaining in the current round/session
	currentActiveRound: TimerRoundResponse | undefined; // The currently active round, if any

	// State setter functions for managing timer state
	setIsRunning: Dispatch<SetStateAction<boolean>>;
	setSecondsLeft: Dispatch<SetStateAction<number>>;
	setActiveRound: Dispatch<SetStateAction<TimerRoundResponse | undefined>>;

	// Optional utility methods for managing timer functionality
	startRound?: () => void; // Start the current round
	pauseRound?: () => void; // Pause the current round
	resetTimer?: () => void; // Reset the timer to its initial state
}
