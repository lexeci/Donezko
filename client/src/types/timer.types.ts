import type { Dispatch, SetStateAction } from "react"; // Type definitions for React state management
import type { RootBase } from "./root.types"; // Base type definition for common properties

/**
 * Type definitions and interfaces for managing timer functionality in a session.
 * Includes definitions for timer rounds, sessions, and states, along with related utilities.
 */

/**
 * Enum representing possible states for a timer round.
 */
export enum TimerRoundStatus {
	NOT_STARTED = "not_started", // Round has not started yet
	RUNNING = "running", // Round is currently running
	COMPLETED = "completed", // Round has been completed
}

/**
 * Interface representing a timer round.
 * Includes details like total seconds, completion status, and round status.
 */
export interface TimerRoundResponse extends RootBase {
	isCompleted?: boolean; // Optional flag indicating if the round is completed
	totalSeconds: number; // Total seconds allocated for this round
	status?: TimerRoundStatus; // Optional status for the round, could be 'not_started', 'running', or 'completed'
}

/**
 * Interface representing a timer session.
 * Contains details about the session status and associated rounds.
 */
export interface TimerSessionResponse extends RootBase {
	isCompleted?: boolean; // Optional flag indicating if the session is completed
	rounds?: TimerRoundResponse[]; // Optional array of rounds associated with this session
}

/**
 * Type for partial state of a timer session.
 * Excludes fields like 'id', 'createdAt', and 'updatedAt' to allow for partial updates.
 */
export type TypeTimerSessionState = Partial<
	Omit<TimerSessionResponse, "id" | "createdAt" | "updatedAt">
>;

/**
 * Type for partial state of a timer round.
 * Excludes fields like 'id', 'createdAt', and 'updatedAt' to allow for partial updates.
 */
export type TypeTimerRoundState = Partial<
	Omit<TimerRoundResponse, "id" | "createdAt" | "updatedAt">
>;

/**
 * Interface for managing the timer state.
 * Defines the structure for handling timer states and operations like start, pause, and reset.
 */
export interface TimerState {
	isRunning: boolean; // Indicates if the timer is currently running (true) or paused/stopped (false)
	secondsLeft: number; // Seconds remaining in the current round/session
	activeRound: TimerRoundResponse | undefined; // The currently active round, if any, otherwise undefined

	// State setter functions for managing timer state
	setIsRunning: Dispatch<SetStateAction<boolean>>; // Function to update the 'isRunning' state
	setSecondsLeft: Dispatch<SetStateAction<number>>; // Function to update the 'secondsLeft' state
	setActiveRound: Dispatch<SetStateAction<TimerRoundResponse | undefined>>; // Function to update the 'activeRound' state

	// Optional utility methods for managing timer functionality
	startRound?: () => void; // Start the current round, if defined
	pauseRound?: () => void; // Pause the current round, if defined
	resetTimer?: () => void; // Reset the timer to its initial state, if defined

	isDataLoaded?: boolean;
}
