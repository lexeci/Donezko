import { axiosWithAuth } from "@/api/interceptors";
import type { TaskFormData, TaskResponse } from "@/types/task.types";
import { toast } from "sonner";

/**
 * @class TaskService
 *
 * Service for managing tasks, including fetching, creating, updating, and deleting tasks.
 * It provides methods to fetch tasks based on various filters, create new tasks, update existing ones,
 * and delete tasks from the system.
 *
 * Methods:
 * - `getTasks`: Fetches tasks based on optional filters like organization, project, team, and availability.
 * - `createTask`: Creates a new task with the provided data.
 * - `updateTask`: Updates an existing task by its ID with the new data.
 * - `deleteTask`: Deletes a task by its ID, associating it with an organization ID.
 *
 * Error handling is included with appropriate toast notifications and error logging.
 *
 * Example usage:
 * @example
 * const tasks = await taskService.getTasks({ organizationId: "org123", projectId: "proj123" });
 * const newTask = await taskService.createTask({ title: "New Task", description: "Task description" });
 * const updatedTask = await taskService.updateTask("task123", { title: "Updated Task" });
 * const deleteResponse = await taskService.deleteTask({ taskId: "task123", organizationId: "org123" });
 */
class TaskService {
	private BASE_URL = "/user/tasks";

	/**
	 * Fetches tasks based on optional filters such as organization, project, team, and availability.
	 * @param organizationId - Optional organization ID to filter tasks.
	 * @param projectId - Optional project ID to filter tasks.
	 * @param teamId - Optional team ID to filter tasks.
	 * @param available - Optional flag to filter available tasks.
	 * @returns A list of tasks that match the provided filters.
	 */
	async getTasks({
		organizationId,
		projectId,
		teamId,
		available,
	}: {
		organizationId?: string | null;
		projectId?: string | null;
		teamId?: string | null;
		available?: boolean;
	}): Promise<TaskResponse[]> {
		const params = new URLSearchParams();

		if (organizationId) params.append("organizationId", organizationId);
		if (projectId) params.append("projectId", projectId);
		if (teamId) params.append("teamId", teamId);
		if (available) params.append("available", "true");

		const url = `${this.BASE_URL}${
			params.toString() ? `?${params.toString()}` : ""
		}`;

		try {
			const response = await axiosWithAuth.get<TaskResponse[]>(url);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error fetching tasks:", error);
			throw new Error("Could not fetch tasks");
		}
	}

	/**
	 * Creates a new task.
	 * @param data - The task data to create.
	 * @returns The created task.
	 */
	async createTask(data: TaskFormData): Promise<TaskResponse> {
		try {
			const response = await axiosWithAuth.post<TaskResponse>(
				this.BASE_URL,
				data
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error creating task:", error);
			throw new Error("Could not create task");
		}
	}

	/**
	 * Updates an existing task.
	 * @param id - The task ID to update.
	 * @param data - The updated task data.
	 * @returns The updated task.
	 */
	async updateTask({
		id,
		data,
		organizationId,
	}: {
		id: string;
		data: TaskFormData;
		organizationId: string;
	}): Promise<TaskResponse> {
		try {
			const response = await axiosWithAuth.put<TaskResponse>(
				`${this.BASE_URL}/${id}/?organizationId=${organizationId}`,
				data
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error updating task:", error);
			throw new Error("Could not update task");
		}
	}

	/**
	 * Deletes a task by its ID and organization ID.
	 * @param taskId - The task ID to delete.
	 * @param organizationId - The organization ID to associate with the deletion.
	 * @returns The Axios response from the deletion request.
	 */
	async deleteTask({
		taskId,
		organizationId,
	}: {
		taskId: string;
		organizationId: string;
	}): Promise<boolean> {
		try {
			return await axiosWithAuth.delete(
				`${this.BASE_URL}/${taskId}/?organizationId=${organizationId}`,
				{
					data: { organizationId },
				}
			);
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error deleting task:", error);
			throw new Error("Could not delete task");
		}
	}
}

export const taskService = new TaskService();
