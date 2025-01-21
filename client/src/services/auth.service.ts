import {axiosClassic} from "@/api/interceptors";
import {AuthForm, AuthResponse} from "@/types/auth.types";
import {toast} from "sonner";
import {clearAuthData, saveTokenStorage} from "./auth-token.service";

/**
 * @class AuthService
 *
 * Service class for handling authentication-related operations, including login, registration,
 * token refresh, and logout. It provides methods to authenticate users, refresh tokens, and manage
 * authentication states with the backend.
 *
 * Methods:
 * - `main`: Handles user login or registration based on the provided operation type ("login" or "register").
 * - `refreshTokens`: Refreshes the authentication tokens to keep the user session active.
 * - `logout`: Logs out the user by clearing authentication data.
 *
 * Error handling and toast notifications are included to provide feedback on successful and failed operations.
 *
 * Example usage:
 * @example
 * const authData = await authService.main("login", { email: "user@example.com", password: "password123" });
 * const refreshedTokens = await authService.refreshTokens();
 * const logoutSuccess = await authService.logout();
 */
class AuthService {
    /**
     * Main method for logging in or registering a user.
     * Sends a POST request to the respective endpoint for login or registration.
     * @param type - The type of operation: "login" or "register"
     * @param data - The form data for authentication (email, password, and optionally name)
     * @returns {Promise<AuthResponse | null>} - The authentication response data or null if error occurs
     * @throws {Error} - Throws an error if the request fails
     * @example
     * const authData = await authService.main("login", { email: "user@example.com", password: "password123" });
     */
    async main(
        type: "login" | "register",
        data: AuthForm
    ): Promise<AuthResponse | null> {
        const {email, password, name, city} = data;
        try {
            const response = await axiosClassic.post<AuthResponse>(`/auth/${type}`, {
                ...{...(name ? {name} : {name: "placeholder name"})},
                ...{...(city ? {city} : {name: "London"})},
                email,
                password,
            });

            if (response.data.accessToken) {
                saveTokenStorage(response.data.accessToken); // Save the access token to storage
            }

            return response.data; // Return the response data instead of the whole response
        } catch (error: any) {
            if (error.response?.status === 404) {
                toast.error("Resource not found! Please check your request.");
                throw error; // Return error for further processing
            }
            toast.error("An unexpected error occurred.");
            console.error("AuthService main error:", error);
            throw error;
        }
    }

    /**
     * Refreshes the authentication tokens.
     * Sends a POST request to refresh the access token.
     * @returns {Promise<AuthResponse | null>} - The authentication response data or null if error occurs
     * @throws {Error} - Throws an error if the request fails
     * @example
     * const refreshedTokens = await authService.refreshTokens();
     */
    async refreshTokens(): Promise<AuthResponse | null> {
        try {
            const response = await axiosClassic.post<AuthResponse>(
                "/auth/login/access-token"
            );

            if (response.data.accessToken) {
                saveTokenStorage(response.data.accessToken); // Save the new access token to storage
            }

            return response.data; // Return the response data
        } catch (error) {
            console.error("AuthService refreshTokens error:", error);
            return null; // Handle error appropriately
        }
    }

    /**
     * Logs out the user.
     * Sends a POST request to the logout endpoint and clears authentication data.
     * @returns {Promise<boolean>} - True if logout is successful, false otherwise
     * @throws {Error} - Throws an error if the request fails
     * @example
     * const logoutSuccess = await authService.logout();
     */
    async logout(): Promise<boolean> {
        try {
            const response = await axiosClassic.post<boolean>("/auth/logout");

            if (response.data) {
                clearAuthData(); // Clear authentication data on successful logout
            }

            return response.data; // Return logout success status
        } catch (error) {
            console.error("AuthService logout error:", error);
            return false; // Handle error appropriately
        }
    }
}

// Create an instance of the AuthService class
export const authService = new AuthService();