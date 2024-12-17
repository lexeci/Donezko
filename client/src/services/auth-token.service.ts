import Cookies from "js-cookie";

// Enum for token types
export enum EnumTokens {
	ACCESS_TOKEN = "accessToken",
	REFRESH_TOKEN = "refreshToken",
}

// Function to get the access token from cookies
export const getAccessToken = (): string | null => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);
	return accessToken || null;
};

// Function to save the access token in cookies
export const saveTokenStorage = (
	accessToken: string, // Explicit type for accessToken
	options?: Cookies.CookieAttributes // Optional configuration for cookie attributes
): void => {
	if (!accessToken) {
		console.error("Access token is required to save in cookies.");
		return;
	}

	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: "localhost",
		sameSite: "strict",
		expires: 1,
		// secure: true, // Ensure this is set to true in production
		...options, // Spread any additional options
	});
};

// Function to clear authentication data from cookies
export const clearAuthData = (): void => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN);
	Cookies.remove(EnumTokens.REFRESH_TOKEN);
	Cookies.remove(EnumTokens.ACCESS_TOKEN, { path: "/" });
	Cookies.remove(EnumTokens.REFRESH_TOKEN, { path: "/" });
};
