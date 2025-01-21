import { axiosWithAuth } from "@/api/interceptors";
import {
	Project,
	ProjectFormData,
	ProjectResponse,
	ProjectRole,
	ProjectUsers,
} from "@/types/project.types";
import { AccessStatus } from "@/types/root.types";
import { toast } from "sonner";
import { OrgUserResponse } from "../types/org.types";

/**
 * @class ProjectService
 *
 * Service for managing projects, users, roles, and statuses within projects.
 * It provides methods to fetch, create, update, and delete projects,
 * as well as manage users, roles, and statuses within a project.
 *
 * Methods:
 * - `getAllProjects`: Fetches all active projects for the current user, optionally filtered by organization ID.
 * - `getProjectById`: Fetches details of a specific project by its ID.
 * - `getAllProjectUsers`: Fetches all users associated with a project.
 * - `getProjectRole`: Fetches the role of the current user within a specific project.
 * - `createProject`: Creates a new project with the provided data.
 * - `updateProject`: Updates an existing project with the given data.
 * - `deleteProject`: Deletes a project by its ID.
 * - `addUserToProject`: Adds a user to a project by their user ID.
 * - `removeUserFromProject`: Removes a user from a project by their user ID.
 * - `updateUserStatus`: Updates the status of a user in a project.
 * - `transferProjectManager`: Transfers the project manager role to another user.
 * - `exitProject`: Allows a user to exit the project.
 *
 * Error handling is included with appropriate toast notifications and error logging.
 *
 * Example usage:
 * @example
 * const projects = await projectService.getAllProjects();
 * const project = await projectService.getProjectById("project123");
 * const users = await projectService.getAllProjectUsers("project123");
 * const newProject = await projectService.createProject({ name: "New Project" });
 * const updatedProject = await projectService.updateProject("project123", { name: "Updated Project" });
 * const deletedProject = await projectService.deleteProject("project123");
 */
class ProjectService {
	private BASE_URL = "/user/organizations/projects";

	/**
	 * Fetches all active projects for a user. If an organization ID is provided, fetches projects from that organization.
	 * @param organizationId - Optional organization ID to filter projects by organization.
	 * @returns {Promise<Project[] | undefined>} - A list of projects.
	 * @throws {Error} - If an error occurs while fetching the projects.
	 * @example
	 * const projects = await projectService.getAllProjects("org123");
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
	 * @returns {Promise<any>} - The project data.
	 * @throws {Error} - If an error occurs while fetching the project.
	 * @example
	 * const project = await projectService.getProjectById("project123");
	 */
	async getProjectById(id: string, organizationId: string): Promise<any> {
		try {
			const response = await axiosWithAuth.get<any>(
				`${this.BASE_URL}/${id}/?organizationId=${organizationId}`
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error fetching project:", error);
			throw new Error("Could not fetch project");
		}
	}

	/**
	 * Fetches all users associated with a project.
	 * @param id - The project ID.
	 * @returns {Promise<ProjectUsers[]>} - A list of users in the project.
	 * @throws {Error} - If an error occurs while fetching the project users.
	 * @example
	 * const users = await projectService.getAllProjectUsers("project123");
	 */
	async getAllProjectUsers(
		id: string,
		organizationId: string
	): Promise<ProjectUsers[]> {
		try {
			const response = await axiosWithAuth.get<ProjectUsers[]>(
				`${this.BASE_URL}/${id}/users/?organizationId=${organizationId}`
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error fetching project users:", error);
			throw new Error("Could not fetch project users");
		}
	}

	/**
	 * Fetches the role of the current user in a specific project.
	 * @param id - The project ID.
	 * @returns {Promise<ProjectRole>} - The role of the user in the project.
	 * @throws {Error} - If an error occurs while fetching the project role.
	 * @example
	 * const role = await projectService.getProjectRole("project123");
	 */
	async getProjectRole(
		id: string,
		organizationId: string
	): Promise<ProjectRole> {
		try {
			const response = await axiosWithAuth.get<ProjectRole>(
				`${this.BASE_URL}/${id}/role/?organizationId=${organizationId}`
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error fetching project role:", error);
			throw new Error("Could not fetch project role");
		}
	}

	/**
	 * Creates a new project with the provided data.
	 * @param data - The project data.
	 * @returns {Promise<any>} - The created project data.
	 * @throws {Error} - If an error occurs while creating the project.
	 * @example
	 * const newProject = await projectService.createProject(projectFormData);
	 */
	async createProject(data: ProjectFormData): Promise<ProjectResponse> {
		try {
			const response = await axiosWithAuth.post<ProjectResponse>(
				this.BASE_URL,
				data
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error creating project:", error);
			throw new Error("Could not create project");
		}
	}

	/**
	 * Updates an existing project with the provided data.
	 * @param id - The project ID.
	 * @param data - The updated project data.
	 * @returns {Promise<any>} - The updated project data.
	 * @throws {Error} - If an error occurs while updating the project.
	 * @example
	 * const updatedProject = await projectService.updateProject("project123", updatedProjectData);
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
	 * Deletes a project by its ID.
	 * @param id - The project ID.
	 * @returns {Promise<void>} - Resolves when the project is deleted.
	 * @throws {Error} - If an error occurs while deleting the project.
	 * @example
	 * await projectService.deleteProject("project123");
	 */
	async deleteProject(
		id: string,
		organizationId: string
	): Promise<ProjectResponse> {
		try {
			return await axiosWithAuth.delete(
				`${this.BASE_URL}/${id}/?organizationId=${organizationId}`
			);
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
	 * @param organizationId - The organization ID.
	 * @returns {Promise<OrgUserResponse>} - The project with the added user.
	 * @throws {Error} - If an error occurs while adding the user.
	 * @example
	 * const updatedProject = await projectService.addUserToProject("project123", "user456");
	 */
	async addUserToProject({
		id,
		userId,
		organizationId,
	}: {
		id: string;
		userId: string;
		organizationId: string;
	}): Promise<OrgUserResponse> {
		try {
			const response = await axiosWithAuth.post<OrgUserResponse>(
				`${this.BASE_URL}/${id}/add-user/?organizationId=${organizationId}`,
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
	 * Removes a user from a project.
	 * @param id - The project ID.
	 * @param userId - The user ID to remove.
	 * @param organizationId - The organization ID.
	 * @returns {Promise<OrgUserResponse>} - The project with the removed user.
	 * @throws {Error} - If an error occurs while removing the user.
	 * @example
	 * const updatedProject = await projectService.removeUserToProject("project123", "user456");
	 */
	async removeUserToProject({
		id,
		userId,
		organizationId,
	}: {
		id: string;
		userId: string;
		organizationId: string;
	}): Promise<OrgUserResponse> {
		try {
			const response = await axiosWithAuth.post<OrgUserResponse>(
				`${this.BASE_URL}/${id}/remove-user/?organizationId=${organizationId}`,
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
	 * @param userId - The user ID.
	 * @param status - The new status for the user.
	 * @param organizationId - The organization ID.
	 * @returns {Promise<any>} - The updated user status in the project.
	 * @throws {Error} - If an error occurs while updating the user status.
	 * @example
	 * const updatedStatus = await projectService.updateUserStatus("project123", "user456", "active");
	 */
	async updateUserStatus({
		id,
		userId,
		status,
		organizationId,
	}: {
		id: string;
		userId: string;
		status: AccessStatus;
		organizationId: string;
	}): Promise<any> {
		try {
			const response = await axiosWithAuth.put<any>(
				`${this.BASE_URL}/${id}/update-status?organizationId=${organizationId}`,
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
	 * Transfers the project manager role to another user.
	 * @param id - The project ID.
	 * @param userId - The new manager's user ID.
	 * @param organizationId - The organization ID.
	 * @returns {Promise<ProjectUsers>} - The updated project user with the new manager.
	 * @throws {Error} - If an error occurs while transferring the manager role.
	 * @example
	 * const updatedProject = await projectService.transferProjectManager("project123", "user456");
	 */
	async transferProjectManager({
		id,
		userId,
		organizationId,
	}: {
		id: string;
		userId: string;
		organizationId: string;
	}): Promise<ProjectUsers> {
		try {
			const response = await axiosWithAuth.put<any>(
				`${this.BASE_URL}/${id}/transfer-manager/?organizationId=${organizationId}`,
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
	 * Exits the project for the current user.
	 * @param id - The project ID.
	 * @param userId - Optional user ID to specify the user exiting the project.
	 * @throws {Error} - If an error occurs while exiting the project.
	 * @example
	 * await projectService.exitProject("project123");
	 */
	async exitProject(id: string, userId?: string): Promise<ProjectResponse> {
		try {
			return await axiosWithAuth.delete(
				`${this.BASE_URL}/${id}/exit${userId ? `/?userId=${userId}` : ""}`
			);
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error exiting project:", error);
			throw new Error("Could not exit project");
		}
	}
}

// Export the service instance for use in other parts of the app
export const projectService = new ProjectService();
