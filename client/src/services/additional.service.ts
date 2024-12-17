import { axiosClassic } from "@/api/interceptors";
import {
	AdviceResponse,
	ElonNewsResponse,
	WeatherResponse,
} from "@/types/additionalApi.types";

class AdditionalService {
	private BASE_URL = "/extended-api";
	private IP_API_URL = "https://ipinfo.io/json?token=a1fd4fa3f79bcc"; // Заміни на ваш API токен для ipinfo.io

	async getWeather(city: string): Promise<WeatherResponse> {
		try {
			const response = await axiosClassic.get<WeatherResponse>(
				`${this.BASE_URL}/weather?city=${city}`
			);
			return response.data;
		} catch (error) {
			console.error(`Fetching weather error:`, error);
			throw new Error(`Fetching weather failed`);
		}
	}

	async getAdvice(): Promise<AdviceResponse> {
		try {
			const response = await axiosClassic.get<AdviceResponse>(
				`${this.BASE_URL}/advice`
			);
			return response.data;
		} catch (error) {
			console.error(`Fetching advice error:`, error);
			throw new Error(`Fetching advice failed`);
		}
	}

	async getElonNews(): Promise<ElonNewsResponse> {
		try {
			const response = await axiosClassic.get<ElonNewsResponse>(
				`${this.BASE_URL}/elonnews`
			);
			return response.data;
		} catch (error) {
			console.error(`Fetching Elon Musk News error:`, error);
			throw new Error(`Fetching Elon Musk News failed`);
		}
	}

	// Додаємо метод для отримання IP
	async getClientIp() {
		try {
			const response = await axiosClassic.get(this.IP_API_URL);
			return response.data; // Це буде об'єкт з IP, містом та іншою інформацією
		} catch (error) {
			console.error("Fetching IP address error:", error);
			throw new Error("Fetching IP address failed");
		}
	}
}

export const additionalService = new AdditionalService();
