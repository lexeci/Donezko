import {
	TimerSessionResponse,
	TypeTimerRoundState,
	TypeTimerSessionState,
} from "@/types/timer.types";

import { axiosWithAuth } from "@/api/interceptors";

class TimerService {
	private BASE_URL = "/user/timer";

	async getTodaySession(): Promise<TimerSessionResponse> {
		try {
			const response = await axiosWithAuth.get<TimerSessionResponse>(
				`${this.BASE_URL}/today`
			);
			return response.data; // Return only the data part
		} catch (error) {
			console.error("Error fetching today's timer session:", error);
			throw new Error("Could not fetch today's timer session"); // Handle error appropriately
		}
	}

	async createSession(): Promise<TimerSessionResponse> {
		try {
			const response = await axiosWithAuth.post<TimerSessionResponse>(
				this.BASE_URL
			);
			return response.data; // Return only the data part
		} catch (error) {
			console.error("Error creating timer session:", error);
			throw new Error("Could not create timer session"); // Handle error appropriately
		}
	}

	async updateSession(
		id: string,
		data: TypeTimerSessionState
	): Promise<boolean> {
		try {
			const response = await axiosWithAuth.put(`${this.BASE_URL}/${id}`, data);
			return response.status === 200; // Return true if the operation was successful
		} catch (error) {
			console.error("Error updating timer session:", error);
			throw new Error("Could not update timer session"); // Handle error appropriately
		}
	}

	async deleteSession(id: string): Promise<boolean> {
		try {
			const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`);
			return response.status === 200; // Return true if the operation was successful
		} catch (error) {
			console.error("Error deleting timer session:", error);
			throw new Error("Could not delete timer session"); // Handle error appropriately
		}
	}

	async updateRound(id: string, data: TypeTimerRoundState): Promise<boolean> {
		try {
			const response = await axiosWithAuth.put(
				`${this.BASE_URL}/round/${id}`,
				data
			);
			return response.status === 200; // Return true if the operation was successful
		} catch (error) {
			console.error("Error updating timer round:", error);
			throw new Error("Could not update timer round"); // Handle error appropriately
		}
	}
}

export const timerService = new TimerService();
