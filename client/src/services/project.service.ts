import { axiosWithAuth } from "@/api/interceptors";
import { Project, ProjectFormData, ProjectUsers } from "@/types/project.types";
import { AccessStatus } from "@/types/root.types";
import { toast } from "sonner";
import { OrgUserResponse } from "../types/org.types";

class ProjectService {
	private BASE_URL = "/user/organizations/projects";

	/**
	 * Fetches all active projects for a user.
	 * If an organization ID is provided, fetches projects from that organization.
	 * @param params - Parameters containing optional organizationId.
	 * @returns A list of projects.
	 */
	async getAllProjects(
		organizationId?: string
	): Promise<Project[] | undefined> {
		try {
			const response = await axiosWithAuth.get<Project[] | undefined>(
				organizationId
					? `${this.BASE_URL}/?organizationId=${organizationId}`
					: this.BASE_URL
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
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
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error fetching project:", error);
			throw new Error("Could not fetch project");
		}
	}

	async getAllProjectUsers(id: string): Promise<ProjectUsers[]> {
		try {
			const response = await axiosWithAuth.get<ProjectUsers[]>(
				`${this.BASE_URL}/${id}/users`
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
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
		} catch (error: any) {
			error && toast.error(error.response.data.message);
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
		} catch (error: any) {
			error && toast.error(error.response.data.message);
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
		} catch (error: any) {
			error && toast.error(error.response.data.message);
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
	async addUserToProject(id: string, userId: string): Promise<OrgUserResponse> {
		try {
			const response = await axiosWithAuth.post<OrgUserResponse>(
				`${this.BASE_URL}/${id}/add-user`,
				{ projectUserId: userId }
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error adding user to project:", error);
			throw new Error("Could not add user to project");
		}
	}

	/**
	 * Removes user from a project.
	 * @param id - The project ID.
	 * @param userId - The user ID to add.
	 * @returns The project with the removed user.
	 */
	async removeUserToProject(
		id: string,
		userId: string
	): Promise<OrgUserResponse> {
		try {
			const response = await axiosWithAuth.post<OrgUserResponse>(
				`${this.BASE_URL}/${id}/remove-user`,
				{ projectUserId: userId }
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error removing user from project:", error);
			throw new Error("Could not remove user from project");
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
				`${this.BASE_URL}/${id}/update-status`,
				{
					projectUserId: userId,
					projectStatus: status,
				}
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error updating user status in project:", error);
			throw new Error("Could not update user status in project");
		}
	}

	/**
	 * Updates the status of a user in a project.
	 * @param id - The project ID.
	 * @param data - The user ID and new status.
	 * @returns The updated project user status.
	 */
	async transferProjectManager(
		id: string,
		userId: string
	): Promise<ProjectUsers> {
		try {
			const response = await axiosWithAuth.put<any>(
				`${this.BASE_URL}/${id}/transfer-manager`,
				{
					newManagerId: userId,
				}
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error(
				"Error transferring manager role to user in project:",
				error
			);
			throw new Error("Could not update user role in project");
		}
	}

	/**
	 * Updates the status of a user in a project.
	 * @param id - The project ID.
	 * @param data - The user ID and new status.
	 * @returns The updated project user status.
	 */
	async useUpdateManager(id: string, userId: string): Promise<ProjectUsers> {
		try {
			const response = await axiosWithAuth.put<any>(
				`${this.BASE_URL}/${id}/transfer-manager`,
				{
					newManagerId: userId,
				}
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error transferring project manager in project", error);
			throw new Error("Could not transfer project manager in project");
		}
	}

	/**
	 * Exits the project for the current user.
	 * @param id - The project ID.
	 */
	async exitProject(id: string, userId?: string): Promise<void> {
		try {
			await axiosWithAuth.delete(
				`${this.BASE_URL}/${id}/exit${userId ? `/?userId=${userId}` : ""}`
			);
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error exiting project:", error);
			throw new Error("Could not exit project");
		}
	}
}

export const projectService = new ProjectService();
