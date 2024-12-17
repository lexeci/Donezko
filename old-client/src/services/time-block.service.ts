import { AxiosResponse } from "axios";

import {
	TimeBlockFormValues,
	TimeBlockResponse,
} from "@/types/time-block.types";
import { axiosWithAuth } from "@/api/interceptors";

class TimeBlockService {
	private BASE_URL = "/user/time-blocks";

	async getTimeBlocks(): Promise<TimeBlockResponse[]> {
		try {
			const response = await axiosWithAuth.get<TimeBlockResponse[]>(
				this.BASE_URL
			);
			return response.data; // Return only the data part
		} catch (error) {
			console.error("Error fetching time blocks:", error);
			throw new Error("Could not fetch time blocks"); // Handle error appropriately
		}
	}

	async createBlock(data: TimeBlockFormValues): Promise<TimeBlockResponse> {
		try {
			const response = await axiosWithAuth.post<TimeBlockResponse>(
				this.BASE_URL,
				data
			);
			return response.data; // Return only the data part
		} catch (error) {
			console.error("Error creating time block:", error);
			throw new Error("Could not create time block"); // Handle error appropriately
		}
	}

	async updateOrderTimeBlock(ids: string[]): Promise<AxiosResponse> {
		try {
			const response = await axiosWithAuth.put(
				`${this.BASE_URL}/update-order`,
				{ ids }
			);
			return response;
		} catch (error) {
			console.error("Error updating time block order:", error);
			throw new Error("Could not update time block order"); // Handle error appropriately
		}
	}

	async updateBlock(
		id: string,
		data: TimeBlockFormValues
	): Promise<TimeBlockResponse> {
		try {
			const response = await axiosWithAuth.put<TimeBlockResponse>(
				`${this.BASE_URL}/${id}`,
				data
			);
			return response.data; // Return only the data part
		} catch (error) {
			console.error("Error updating time block:", error);
			throw new Error("Could not update time block"); // Handle error appropriately
		}
	}

	async deleteBlock(id: string): Promise<AxiosResponse> {
		try {
			const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`);
			return response;
		} catch (error) {
			console.error("Error deleting time block:", error);
			throw new Error("Could not delete time block"); // Handle error appropriately
		}
	}
}

export const timeBlockService = new TimeBlockService();
