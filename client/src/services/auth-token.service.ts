import Cookies from "js-cookie";

// Enum for token types
export enum EnumTokens {
    ACCESS_TOKEN = "accessToken", // The access token identifier
    REFRESH_TOKEN = "refreshToken", // The refresh token identifier
}

/**
 * Retrieves the access token from cookies.
 * @returns {string | null} - The access token if available, otherwise null
 * @example
 * const token = getAccessToken();
 */
export const getAccessToken = (): string | null => {
    const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);
    return accessToken || null;
};

/**
 * Saves the access token in cookies with optional attributes.
 * @param accessToken - The access token to be stored
 * @param options - Optional configuration for cookie attributes
 * @returns {void}
 * @example
 * saveTokenStorage("your-access-token");
 */
export const saveTokenStorage = (
    accessToken: string, // The access token to be saved
    options?: Cookies.CookieAttributes // Optional configuration for cookie attributes
): void => {
    if (!accessToken) {
        console.error("Access token is required to save in cookies.");
        return;
    }

    Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
        domain: "localhost", // Specifies the domain for the cookie
        sameSite: "strict", // SameSite attribute for cross-site request handling
        expires: 1, // The cookie will expire in 1 day
        // secure: true, // Ensure this is set to true in production for secure cookies
        ...options, // Spread any additional options (e.g., path, domain)
    });
};

/**
 * Clears authentication data (tokens) from cookies.
 * Removes both access and refresh tokens from cookies.
 * @returns {void}
 * @example
 * clearAuthData();
 */
export const clearAuthData = (): void => {
    Cookies.remove(EnumTokens.ACCESS_TOKEN); // Remove the access token
    Cookies.remove(EnumTokens.REFRESH_TOKEN); // Remove the refresh token
    Cookies.remove(EnumTokens.ACCESS_TOKEN, {path: "/", secure: true, sameSite: 'Strict'}); // Remove with path and secure settings
    Cookies.remove(EnumTokens.REFRESH_TOKEN, {path: "/", secure: true, sameSite: 'Strict'}); // Remove with path and secure settings
};
