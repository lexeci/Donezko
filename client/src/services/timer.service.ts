import {
	TimerSessionResponse,
	TypeTimerRoundState,
	TypeTimerSessionState,
} from "@/types/timer.types";

import { axiosWithAuth } from "@/api/interceptors";

class TimerService {
	private BASE_URL = "/user/timer";

	async getTodaySession() {
		const response = await axiosWithAuth.get<TimerSessionResponse>(
			`${this.BASE_URL}/today`
		);
		return response;
	}

	async createSession() {
		const response = await axiosWithAuth.post<TimerSessionResponse>(
			this.BASE_URL
		);
		return response;
	}

	async updateSession(id: string, data: TypeTimerSessionState) {
		const response = await axiosWithAuth.put(`${this.BASE_URL}/${id}`, data);
		return response;
	}

	async deleteSession(id: string) {
		const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`);
		return response;
	}

	async updateRound(id: string, data: TypeTimerRoundState) {
		const response = await axiosWithAuth.put(
			`${this.BASE_URL}/round/${id}`,
			data
		);
		return response;
	}
}

export const timerService = new TimerService();
