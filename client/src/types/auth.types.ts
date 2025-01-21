import {UUID} from "./root.types";

/**
 * Interface representing the data structure of an authentication form.
 * Used for user login or registration with essential fields like email, name, and password.
 */
export interface AuthForm {
    email: string; // User's email address
    name: string; // User's name
    city: string // User's city
    password: string; // User's password
}

/**
 * Interface representing the authenticated user's details.
 * Includes essential user information such as ID, name, email, and optional work/break intervals for productivity tracking.
 */
export interface AuthUser {
    id: UUID; // Unique identifier for the user
    name: string; // Optional user's name
    email: string; // User's email address
    city: string; // User's city address

    workInterval?: number; // Optional work session duration in minutes
    breakInterval?: number; // Optional break duration in minutes
    intervalsCount?: number; // Optional count of completed intervals

    _count?: {
        tasks: number; // The count of tasks assigned to the user
    };
}

/**
 * Interface representing a statistic, typically used for displaying summarized data.
 * It consists of a label and a value, where the value could either be a number or a string.
 */
interface Statistic {
    label: string; // Label representing the statistic
    value: number | string; // The value of the statistic, could be a number or string
}

/**
 * Interface representing the response from an authentication request.
 * Includes the access token used for making authenticated requests and the user's details.
 */
export interface AuthResponse {
    accessToken: string; // Access token for authenticated requests
    user: AuthUser; // Authenticated user's details
}

/**
 * Type representing user data for updates, excluding the ID.
 * This type is used when updating user data, and the password field is optional.
 */
export type UserFormType = Omit<AuthUser, "id"> & { password?: string }; // User data without the ID, with an optional password
