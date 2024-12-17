import { AxiosResponse } from "axios";

import { axiosWithAuth } from "@/api/interceptors";
import type { TaskFormData, TaskResponse } from "@/types/task.types";

class TaskService {
	private BASE_URL = "/user/tasks";

	async getTasks(): Promise<TaskResponse[]> {
		try {
			const response = await axiosWithAuth.get<TaskResponse[]>(this.BASE_URL);
			return response.data; // Return only the data part
		} catch (error) {
			console.error("Error fetching tasks:", error);
			throw new Error("Could not fetch tasks"); // Rethrow or handle error appropriately
		}
	}

	async createTask(data: TaskFormData): Promise<TaskResponse> {
		try {
			const response = await axiosWithAuth.post<TaskResponse>(
				this.BASE_URL,
				data
			);
			return response.data; // Return only the data part
		} catch (error) {
			console.error("Error creating task:", error);
			throw new Error("Could not create task"); // Handle error appropriately
		}
	}

	async updateTask(id: string, data: TaskFormData): Promise<TaskResponse> {
		try {
			const response = await axiosWithAuth.put<TaskResponse>(
				`${this.BASE_URL}/${id}`,
				data
			);
			return response.data; // Return only the data part
		} catch (error) {
			console.error("Error updating task:", error);
			throw new Error("Could not update task"); // Handle error appropriately
		}
	}

	async deleteTask(id: string): Promise<AxiosResponse> {
		try {
			const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`);
			return response; // Check if the deletion was successful
		} catch (error) {
			console.error("Error deleting task:", error);
			throw new Error("Could not delete task"); // Handle error appropriately
		}
	}
}

export const taskService = new TaskService();
