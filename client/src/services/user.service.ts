import {AuthUser, UserFormType} from "@/types/auth.types";
import {axiosWithAuth} from "@/api/interceptors";

/**
 * Interface to represent the response structure for user profile data.
 */
export interface ProfileResponse {
    user: AuthUser; // The user object containing user details.
    statistics: {
        label: string; // The label for a statistic (e.g., 'Total tasks completed').
        value: string; // The value associated with the statistic (e.g., '15').
    }[];
}

/**
 * @class UserService
 *
 * Service for interacting with the user profile API.
 * It includes functionality for retrieving and updating the user profile data.
 *
 * Methods:
 * - `getProfile`: Fetches the current user profile data along with statistics.
 * - `update`: Updates the user profile with new information.
 *
 * Error handling is included, with appropriate logging and error messages when operations fail.
 *
 * Example usage:
 * @example
 * const profile = await userService.getProfile();
 * const updatedProfile = await userService.update({ username: "newUsername" });
 */
class UserService {
    private BASE_URL = "/user/profile"; // The base URL for user profile-related API endpoints.

    /**
     * Fetches the current user profile data.
     * This method sends a GET request to retrieve the user profile and associated statistics.
     * @returns {Promise<ProfileResponse>} The user profile data including user information and statistics.
     * @throws Will throw an error if the request fails.
     */
    async getProfile(): Promise<ProfileResponse> {
        try {
            const response = await axiosWithAuth.get<ProfileResponse>(this.BASE_URL);
            return response.data; // Return the profile data from the response.
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Could not fetch user profile"); // Handle errors if the fetch fails.
        }
    }

    /**
     * Updates the user profile with new data.
     * This method sends a PUT request to update the user's profile information with the provided data.
     * @param {UserFormType} data - The new user data to update.
     * @returns {Promise<AuthUser>} The updated user profile data.
     * @throws Will throw an error if the update request fails.
     */
    async update(data: UserFormType): Promise<AuthUser> {
        try {
            const response = await axiosWithAuth.put<ProfileResponse>(this.BASE_URL, data);
            return response.data.user; // Return only the updated user part of the response.
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw new Error("Could not update user profile"); // Handle errors if the update fails.
        }
    }
}

// Export the instance of the UserService for use in other parts of the application.
export const userService = new UserService();
