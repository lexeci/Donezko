import {clearAuthData, getAccessToken} from "@/services/auth-token.service";
import {authService} from "@/services/auth.service";
import axios, {type CreateAxiosDefaults} from "axios";
import {parseErrorMessage} from "@/api/error";

/**
 * Axios setup for making HTTP requests with authentication handling and error processing.
 * This file defines configuration options for Axios, including interceptors for token handling and error responses.
 *
 * It provides two Axios instances:
 * - `axiosClassic`: A basic Axios instance for unauthenticated requests.
 * - `axiosWithAuth`: A pre-configured Axios instance with authentication and error handling.
 */

/**
 * Axios configuration options for making HTTP requests.
 * Includes settings for base URL, content type, and request timeout.
 * @constant options
 */
const options: CreateAxiosDefaults = {
    baseURL: "http://localhost:3001/api/", // The base URL for API requests
    headers: {
        "Content-Type": "application/json", // Set Content-Type to JSON for all requests
    },
    withCredentials: true, // Include credentials with requests (cookies)
    timeout: 10000, // Timeout set to 10 seconds for requests
};

/**
 * Axios instance for unauthenticated requests.
 * @constant axiosClassic
 */
const axiosClassic = axios.create(options);

/**
 * Axios instance for authenticated requests.
 * Includes interceptors for adding the authorization token and handling token expiration.
 * @constant axiosWithAuth
 */
const axiosWithAuth = axios.create(options);

/**
 * Request interceptor for `axiosWithAuth` to add the Authorization token in the headers.
 * Checks if a valid token exists and attaches it to the request headers.
 */
axiosWithAuth.interceptors.request.use(config => {
    const accessToken = getAccessToken(); // Retrieve the access token

    if (config?.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`; // Add token to headers
    }

    return config;
});

/**
 * Response interceptor for `axiosWithAuth` to handle token expiration and retry requests.
 * If a request fails with a 401 status or an expired token error, attempts to refresh the tokens and retry the request.
 * @async
 */
axiosWithAuth.interceptors.response.use(
    response => response, // Return the response if successful
    async error => {
        const originalRequest = error.config;

        // If the error is a 401 or JWT expired error, try to refresh the token
        if (
            (error?.response?.status === 401 ||
                parseErrorMessage(error) === "jwt expired" ||
                parseErrorMessage(error) === "jwt must be provided") &&
            !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true; // Mark the request to avoid retrying it multiple times

            try {
                // Attempt to refresh the tokens
                await authService.refreshTokens();

                // Retry the original request after refreshing the token
                return axiosWithAuth.request(originalRequest);
            } catch (retryError) {
                if (parseErrorMessage(retryError) === "jwt expired") {
                    console.error("Refresh token expired, clearing auth data.");
                    clearAuthData(); // Clear auth data if refresh token has expired
                } else {
                    console.error("Error during token refresh:", retryError);
                }
            }
        }

        // If error cannot be resolved, throw the error
        throw error;
    }
);

export {axiosClassic, axiosWithAuth};
