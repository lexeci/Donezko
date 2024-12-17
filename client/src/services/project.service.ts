import { axiosWithAuth } from "@/api/interceptors";
import { ProjectFormData, ProjectResponse } from "@/types/project.types";
import { AccessStatus } from "@/types/root.types";

class ProjectService {
	private BASE_URL = "/user/organizations/projects";

	/**
	 * Fetches all active projects for a user.
	 * If an organization ID is provided, fetches projects from that organization.
	 * @param params - Parameters containing optional organizationId.
	 * @returns A list of projects.
	 */
	async getAllProjects(organizationId?: string): Promise<ProjectResponse[]> {
		try {
			const response = await axiosWithAuth.get<ProjectResponse[]>(
				this.BASE_URL,
				{ data: organizationId }
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching projects:", error);
			throw new Error("Could not fetch projects");
		}
	}

	/**
	 * Fetches a single project by its ID.
	 * @param id - The project ID.
	 * @returns The project data.
	 */
	async getProjectById(id: string): Promise<any> {
		try {
			const response = await axiosWithAuth.get<any>(`${this.BASE_URL}/${id}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching project:", error);
			throw new Error("Could not fetch project");
		}
	}

	/**
	 * Creates a new project.
	 * @param data - The project data.
	 * @returns The created project.
	 */
	async createProject(data: ProjectFormData): Promise<any> {
		try {
			const response = await axiosWithAuth.post<any>(this.BASE_URL, data);
			return response.data;
		} catch (error) {
			console.error("Error creating project:", error);
			throw new Error("Could not create project");
		}
	}

	/**
	 * Updates an existing project.
	 * @param id - The project ID.
	 * @param data - The updated project data.
	 * @returns The updated project.
	 */
	async updateProject(id: string, data: ProjectFormData): Promise<any> {
		try {
			const response = await axiosWithAuth.put<any>(
				`${this.BASE_URL}/${id}`,
				data
			);
			return response.data;
		} catch (error) {
			console.error("Error updating project:", error);
			throw new Error("Could not update project");
		}
	}

	/**
	 * Deletes a project.
	 * @param id - The project ID.
	 */
	async deleteProject(id: string): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/${id}`);
		} catch (error) {
			console.error("Error deleting project:", error);
			throw new Error("Could not delete project");
		}
	}

	/**
	 * Adds a user to a project.
	 * @param id - The project ID.
	 * @param userId - The user ID to add.
	 * @returns The project with the added user.
	 */
	async addUserToProject(id: string, userId: string): Promise<any> {
		try {
			const response = await axiosWithAuth.post<any>(
				`${this.BASE_URL}/add-user/${id}`,
				{ projectUserId: userId }
			);
			return response.data;
		} catch (error) {
			console.error("Error adding user to project:", error);
			throw new Error("Could not add user to project");
		}
	}

	/**
	 * Updates the status of a user in a project.
	 * @param id - The project ID.
	 * @param data - The user ID and new status.
	 * @returns The updated project user status.
	 */
	async updateUserStatus(
		id: string,
		userId: string,
		status: AccessStatus
	): Promise<any> {
		try {
			const response = await axiosWithAuth.put<any>(
				`${this.BASE_URL}/update-status/${id}`,
				{
					userId,
					status,
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error updating user status in project:", error);
			throw new Error("Could not update user status in project");
		}
	}

	/**
	 * Exits the project for the current user.
	 * @param id - The project ID.
	 */
	async exitProject(id: string): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/exit/${id}`);
		} catch (error) {
			console.error("Error exiting project:", error);
			throw new Error("Could not exit project");
		}
	}
}

export const projectService = new ProjectService();
