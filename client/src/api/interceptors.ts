import axios, { type CreateAxiosDefaults } from "axios";

import { clearAuthData, getAccessToken } from "@/services/auth-token.service"; // Змінили назву на більш зрозумілу
import { authService } from "@/services/auth.service";
import { parseErrorMessage } from "./error";

// Налаштування для axios запитів
const options: CreateAxiosDefaults = {
	baseURL: "http://localhost:3001/api/",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
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

		// Перевіряємо, чи потрібно оновити токен
		if (
			(error?.response?.status === 401 ||
				parseErrorMessage(error) === "jwt expired" ||
				parseErrorMessage(error) === "jwt must be provided") &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true;

			try {
				// Отримання нових токенів і повторний запит
				await authService.refreshTokens(); // Змінили назву методу для кращого розуміння
				return axiosWithAuth.request(originalRequest); // Виконуємо оригінальний запит з новими токенами
			} catch (retryError) {
				if (parseErrorMessage(retryError) === "jwt expired") {
					clearAuthData(); // Видаляємо дані авторизації, якщо токен знову прострочений
				}
			}
		}

		throw error;
	}
);

export { axiosClassic, axiosWithAuth };
