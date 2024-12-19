import { axiosWithAuth } from "@/api/interceptors";
import type {
	ManageTeamData,
	TeamFormData,
	TeamResponse,
	TeamsProjectResponse,
	TeamsResponse,
	TeamWithUsersResponse,
} from "@/types/team.types";
import { toast } from "sonner";

class TeamService {
	private BASE_URL = "/user/organizations/teams";

	/**
	 * Fetches teams associated with the current user.
	 * @returns A list of teams with their users.
	 */
	async getUserTeams(): Promise<TeamWithUsersResponse[]> {
		try {
			const response = await axiosWithAuth.get<TeamWithUsersResponse[]>(
				`${this.BASE_URL}/user-teams`
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error fetching user teams:", error);
			throw new Error("Could not fetch user teams");
		}
	}

	/**
	 * Fetches all teams for a specific organization.
	 * @param organizationId - The organization ID.
	 * @returns A list of teams with their users.
	 */
	async getAllTeams(
		organizationId: string,
		projectId?: string | null
	): Promise<TeamsResponse[]> {
		try {
			const response = await axiosWithAuth.get<TeamsResponse[]>(
				`${this.BASE_URL}?organizationId=${organizationId}${
					projectId ? `&projectId=${projectId}` : ""
				}`
			);
			console.log(response.data);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error fetching all teams:", error);
			throw new Error("Could not fetch all teams");
		}
	}

	/**
	 * Fetches all teams for a specific project within organization.
	 * @param organizationId - The organization ID.
	 * @param projectId - The project ID.
	 * @returns A list of teams with their users.
	 */
	async getAllTeamsByProject(
		organizationId: string,
		projectId: string
	): Promise<TeamsProjectResponse> {
		try {
			const response = await axiosWithAuth.get<TeamsProjectResponse>(
				`${this.BASE_URL}/project/?organizationId=${organizationId}&projectId=${projectId}`
			);
			console.log(response.data);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error fetching all teams for project:", error);
			throw new Error("Could not fetch all teams for project");
		}
	}

	/**
	 * Fetches a specific team by its ID.
	 * @param id - The team ID.
	 * @param organizationId - The organization ID.
	 * @returns A team object with its users.
	 */
	async getTeamById(id: string, organizationId: string): Promise<TeamResponse> {
		try {
			const response = await axiosWithAuth.get<TeamResponse>(
				`${this.BASE_URL}/${id}?organizationId=${organizationId}`
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error fetching team by ID:", error);
			throw new Error("Could not fetch team by ID");
		}
	}

	/**
	 * Creates a new team.
	 * @param data - Team form data.
	 * @returns The newly created team.
	 */
	async createTeam(data: TeamFormData): Promise<TeamResponse> {
		try {
			const response = await axiosWithAuth.post<TeamResponse>(
				this.BASE_URL,
				data
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error creating team:", error);
			throw new Error("Could not create team");
		}
	}

	/**
	 * Updates an existing team.
	 * @param id - The team ID.
	 * @param data - Updated team form data.
	 * @returns The updated team.
	 */
	async updateTeam(id: string, data: TeamFormData): Promise<TeamResponse> {
		try {
			const response = await axiosWithAuth.put<TeamResponse>(
				`${this.BASE_URL}/${id}`,
				data
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error updating team:", error);
			throw new Error("Could not update team");
		}
	}

	/**
	 * Deletes a team.
	 * @param id - The team ID.
	 * @param data - Data required for deletion.
	 */
	async deleteTeam(id: string, organizationId: string): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/${id}`, {
				data: {
					organizationId,
				},
			});
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error deleting team:", error);
			throw new Error("Could not delete team");
		}
	}

	/**
	 * Links a team to a project.
	 * @param id - The team ID.
	 * @param data - Data containing the project and organization details.
	 * @returns The updated team.
	 */
	async linkToProject({
		id,
		projectId,
		organizationId,
	}: {
		id: string;
		projectId: string;
		organizationId: string;
	}): Promise<TeamsProjectResponse> {
		try {
			const data = { projectId, organizationId };
			const response = await axiosWithAuth.put<TeamsProjectResponse>(
				`${this.BASE_URL}/${id}/link-project`,
				data
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error linking team to project:", error);
			throw new Error("Could not link team to project");
		}
	}

	/**
	 * Unlinks a team from project.
	 * @param id - The team ID.
	 * @param data - Data containing the project and organization details.
	 */
	async unlinkFromProject({
		id,
		projectId,
		organizationId,
	}: {
		id: string;
		projectId: string;
		organizationId: string;
	}): Promise<TeamsProjectResponse> {
		try {
			const data = { projectId, organizationId };
			const response = await axiosWithAuth.put<TeamsProjectResponse>(
				`${this.BASE_URL}/${id}/unlink-project`,
				data
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error unlinking team to project:", error);
			throw new Error("Could not unlink team to project");
		}
	}

	/**
	 * Adds a user to a team.
	 * @param id - The team ID.
	 * @param data - Data about the user to add.
	 * @returns The updated team with its users.
	 */
	async addUserToTeam(
		id: string,
		data: ManageTeamData
	): Promise<TeamWithUsersResponse> {
		try {
			const response = await axiosWithAuth.post<TeamWithUsersResponse>(
				`${this.BASE_URL}/${id}/users`,
				data
			);
			return response.data;
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error adding user to team:", error);
			throw new Error("Could not add user to team");
		}
	}

	/**
	 * Removes a user from a team.
	 * @param id - The team ID.
	 * @param data - Data about the user to remove.
	 */
	async removeUserFromTeam(id: string, data: ManageTeamData): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/${id}/users`, { data });
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error removing user from team:", error);
			throw new Error("Could not remove user from team");
		}
	}

	/**
	 * Transfers leadership within a team.
	 * @param id - The team ID.
	 * @param data - Data about the new leader.
	 */
	async transferLeadership(id: string, data: ManageTeamData): Promise<void> {
		try {
			await axiosWithAuth.put(`${this.BASE_URL}/${id}/transfer-leader`, data);
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error transferring leadership:", error);
			throw new Error("Could not transfer leadership");
		}
	}

	/**
	 * Allows the current user to exit a team.
	 * @param id - The team ID.
	 */
	async exitFromTeam(id: string): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/${id}/users/exit`);
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error exiting from team:", error);
			throw new Error("Could not exit from team");
		}
	}
}

export const teamService = new TeamService();
