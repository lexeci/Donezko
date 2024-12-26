import { UUID } from "./root.types";

/**
 * Interface representing the data structure of an authentication form.
 */
export interface AuthForm {
	email: string; // User's email address
	name: string; // User's name
	password: string; // User's password
}

/**
 * Interface representing the authenticated user's details.
 */
export interface AuthUser {
	id: UUID; // Unique identifier for the user
	name: string; // Optional user's name
	email: string; // User's email address

	workInterval?: number; // Optional work session duration in minutes
	breakInterval?: number; // Optional break duration in minutes
	intervalsCount?: number; // Optional count of completed intervals

	_count?: {
		tasks: number;
	};
}

interface Statistic {
	label: string;
	value: number | string; // Adjust based on actual data types
}

/**
 * Interface representing the response from an authentication request.
 */
export interface AuthResponse {
	accessToken: string; // Access token for authenticated requests
	user: AuthUser; // Authenticated user's details
}

/**
 * Type representing user data for updates, excluding the ID.
 */
export type UserFormType = Omit<AuthUser, "id"> & { password?: string }; // User data without the ID, with an optional password
