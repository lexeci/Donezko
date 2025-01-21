import {
	TimerSessionResponse,
	TypeTimerRoundState,
	TypeTimerSessionState,
} from "@/types/timer.types";

import { axiosWithAuth } from "@/api/interceptors";

/**
 * @class TimerService
 *
 * Service for interacting with the timer session API.
 * It includes functionality for managing timer sessions and rounds for the user.
 *
 * Methods:
 * - `getTodaySession`: Fetches today's timer session.
 * - `createSession`: Creates a new timer session.
 * - `updateSession`: Updates an existing timer session by its ID.
 * - `deleteSession`: Deletes a timer session by its ID.
 * - `updateRound`: Updates the state of a timer round by its ID.
 *
 * The service uses HTTP methods to send requests to the server and handle responses.
 * Error handling is included, with appropriate logging and error messages when operations fail.
 *
 * Example usage:
 * @example
 * const todaySession = await timerService.getTodaySession();
 * const newSession = await timerService.createSession();
 * const updatedSession = await timerService.updateSession("session123", { state: "active" });
 * const deleteResponse = await timerService.deleteSession("session123");
 * const updateRoundResponse = await timerService.updateRound("round123", { state: "paused" });
 */
class TimerService {
	private BASE_URL = "/user/timer";

	/**
	 * Private method to handle HTTP requests (GET, POST, PUT, DELETE).
	 * This method generalizes the logic for sending different types of HTTP requests,
	 * reducing redundancy in the code.
	 * @param url - The URL to which the request is made.
	 * @param method - The HTTP method (GET, POST, PUT, DELETE).
	 * @param data - The data to send with the request (optional, used for POST and PUT).
	 * @returns The response data (for GET) or true if the operation is successful (for POST, PUT, DELETE).
	 */
	private async requestData(
		url: string,
		method: "get" | "post" | "put" | "delete",
		data?: any
	): Promise<any> {
		try {
			const response = await axiosWithAuth[method](url, data);

			// For GET requests, return the response data
			if (method === "get") {
				return response.data;
			}

			// For POST, PUT, DELETE requests, return true if the operation was successful (status 200)
			return response.status === 200;
		} catch (error: any) {
			console.error(`Error ${method}ing data at ${url}:`, error);
			throw new Error(`Could not ${method} data at ${url}`); // Handle any error that occurs during the request
		}
	}

	/**
	 * Fetches data from the provided URL using a GET request.
	 * @param url - The URL to fetch data from.
	 * @returns The fetched data.
	 */
	private async fetchData(url: string): Promise<any> {
		return this.requestData(url, "get");
	}

	/**
	 * Sends data to the provided URL using a POST request.
	 * @param url - The URL to send data to.
	 * @returns The result of the POST request (response data).
	 */
	private async sendData(url: string): Promise<any> {
		return this.requestData(url, "post");
	}

	/**
	 * Updates data at the provided URL using a PUT request.
	 * @param url - The URL where the data should be updated.
	 * @param data - The data to update.
	 * @returns `true` if the update was successful, otherwise `false`.
	 */
	private async updateData(url: string, data: any): Promise<boolean> {
		return this.requestData(url, "put", data);
	}

	/**
	 * Deletes data at the provided URL using a DELETE request.
	 * @param url - The URL to delete data from.
	 * @returns `true` if the deletion was successful, otherwise `false`.
	 */
	private async deleteData(url: string): Promise<boolean> {
		return this.requestData(url, "delete");
	}

	/**
	 * Fetches today's timer session.
	 * @returns Today's timer session data.
	 * @throws Error if unable to fetch today's timer session.
	 */
	async getTodaySession(): Promise<TimerSessionResponse> {
		return this.fetchData(`${this.BASE_URL}/today`);
	}

	/**
	 * Creates a new timer session.
	 * @returns The created timer session.
	 * @throws Error if unable to create a timer session.
	 */
	async createSession(): Promise<TimerSessionResponse> {
		return this.sendData(`${this.BASE_URL}`);
	}

	/**
	 * Updates an existing timer session.
	 * @param id - The session ID.
	 * @param data - The data to update.
	 * @returns A boolean indicating the success of the update.
	 * @throws Error if unable to update the timer session.
	 */
	async updateSession(
		id: string,
		data: TypeTimerSessionState
	): Promise<boolean> {
		return this.updateData(`${this.BASE_URL}/${id}`, data);
	}

	/**
	 * Deletes a timer session.
	 * @param id - The session ID.
	 * @returns A boolean indicating the success of the deletion.
	 * @throws Error if unable to delete the timer session.
	 */
	async deleteSession(id: string): Promise<boolean> {
		return this.deleteData(`${this.BASE_URL}/${id}`);
	}

	/**
	 * Updates the state of a timer round.
	 * @param id - The round ID.
	 * @param data - The data to update.
	 * @returns A boolean indicating the success of the update.
	 * @throws Error if unable to update the timer round.
	 */
	async updateRound(id: string, data: TypeTimerRoundState): Promise<boolean> {
		return this.updateData(`${this.BASE_URL}/round/${id}`, data);
	}
}

export const timerService = new TimerService();
