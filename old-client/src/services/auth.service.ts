import { axiosClassic } from "@/api/interceptors";
import { AuthForm, AuthResponse } from "@/types/auth.types";
import { clearAuthData, saveTokenStorage } from "./auth-token.service";

export const authService = {
	async main(
		type: "login" | "register",
		data: AuthForm
	): Promise<AuthResponse | null> {
		try {
			const response = await axiosClassic.post<AuthResponse>(
				`/auth/${type}`,
				data
			);

			if (response.data.accessToken) {
				saveTokenStorage(response.data.accessToken);
			}

			return response.data; // Return the response data instead of the whole response
		} catch (error) {
			console.error("AuthService main error:", error);
			return null; // Handle error appropriately
		}
	},

	async refreshTokens(): Promise<AuthResponse | null> {
		try {
			const response = await axiosClassic.post<AuthResponse>(
				"/auth/login/access-token"
			);

			if (response.data.accessToken) {
				saveTokenStorage(response.data.accessToken);
			}

			return response.data; // Return the response data
		} catch (error) {
			console.error("AuthService refreshTokens error:", error);
			return null; // Handle error appropriately
		}
	},

	async logout(): Promise<boolean> {
		try {
			const response = await axiosClassic.post<boolean>("/auth/logout");

			if (response.data) {
				clearAuthData();
			}

			return response.data; // Return logout success status
		} catch (error) {
			console.error("AuthService logout error:", error);
			return false; // Handle error appropriately
		}
	},
};
