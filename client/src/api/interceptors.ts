import { clearAuthData, getAccessToken } from "@/services/auth-token.service";
import { authService } from "@/services/auth.service";
import axios, { type CreateAxiosDefaults } from "axios";
import { parseErrorMessage } from "./error";

// Налаштування для axios запитів
const options: CreateAxiosDefaults = {
	baseURL: "http://localhost:3001/api/",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
	timeout: 10000, // Таймаут 10 секунд
};

// Ініціалізація екземплярів axios
const axiosClassic = axios.create(options);
const axiosWithAuth = axios.create(options);

// Інтерсептор для додавання токенів авторизації
axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken();

	if (config?.headers && accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

// Інтерсептор для обробки помилок та оновлення токенів
axiosWithAuth.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		if (
			(error?.response?.status === 401 ||
				parseErrorMessage(error) === "jwt expired" ||
				parseErrorMessage(error) === "jwt must be provided") &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true;

			try {
				// Оновлення токенів
				await authService.refreshTokens();

				// Повторний запит
				return axiosWithAuth.request(originalRequest);
			} catch (retryError) {
				if (parseErrorMessage(retryError) === "jwt expired") {
					console.error("Refresh token expired, clearing auth data.");
					clearAuthData(); // Видаляємо дані авторизації
				} else {
					console.error("Error during token refresh:", retryError);
				}
			}
		}

		// Якщо помилка інша або повторний запит провалився, кидаємо помилку далі
		throw error;
	}
);

export { axiosClassic, axiosWithAuth };
