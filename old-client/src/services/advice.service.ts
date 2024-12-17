import { axiosWithAuth } from "@/api/interceptors";

export interface AdviceResponse {
	slip: {
		id: number;
		advice: string;
	};
}

class AdviceService {
	private BASE_URL = "/extended-api/advice";

	/**
	 * Fetches the advice api data.
	 * @returns {Promise<AdviceResponse>} The advice data from api.
	 */
	async getAdvice(): Promise<AdviceResponse> {
		try {
			const response = await axiosWithAuth.get<AdviceResponse>(this.BASE_URL);
			return response.data; // Return only the user part of the response
		} catch (error) {
			console.error("Error fetching advice:", error);
			throw new Error("Could not fetch advice"); // Handle error appropriately
		}
	}
}

export const adviceService = new AdviceService();
