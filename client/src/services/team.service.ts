import { axiosWithAuth } from "@/api/interceptors";
import type {
	ManageTeamData,
	TeamFormData,
	TeamResponse,
	TeamWithUsersResponse,
} from "@/types/team.types";

class TeamService {
	private BASE_URL = "/user/organizations/projects/teams";

	/**
	 * Fetches teams associated with a user.
	 * @param userId - The user ID.
	 * @returns A list of teams with their users.
	 */
	async getUserTeams(): Promise<TeamWithUsersResponse[]> {
		try {
			const response = await axiosWithAuth.get(`${this.BASE_URL}/user-teams`);
			return response.data;
		} catch (error) {
			console.error("Error fetching teams:", error);
			throw new Error("Could not fetch teams");
		}
	}

	async getAllTeams(
		organizationId: string,
		projectId: string
	): Promise<TeamWithUsersResponse[]> {
		try {
			const response = await axiosWithAuth.get<TeamWithUsersResponse[]>(
				`${this.BASE_URL}?organizationId=${organizationId}&projectId=${projectId}`
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching teams:", error);
			throw new Error("Could not fetch teams");
		}
	}

	async getTeamById(
		id: string,
		organizationId: string,
		projectId: string
	): Promise<TeamWithUsersResponse> {
		try {
			const response = await axiosWithAuth.get<TeamWithUsersResponse>(
				`${this.BASE_URL}/${id}?organizationId=${organizationId}&projectId=${projectId}`
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching team:", error);
			throw new Error("Could not fetch team");
		}
	}

	async createTeam(data: TeamFormData): Promise<TeamResponse> {
		try {
			const response = await axiosWithAuth.post<TeamResponse>(
				this.BASE_URL,
				data
			);
			return response.data;
		} catch (error) {
			console.error("Error creating team:", error);
			throw new Error("Could not create team");
		}
	}

	async updateTeam(id: string, data: TeamFormData): Promise<TeamResponse> {
		try {
			const response = await axiosWithAuth.put<TeamResponse>(
				`${this.BASE_URL}/${id}`,
				data
			);
			return response.data;
		} catch (error) {
			console.error("Error updating team:", error);
			throw new Error("Could not update team");
		}
	}

	async deleteTeam(id: string): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/${id}`);
		} catch (error) {
			console.error("Error deleting team:", error);
			throw new Error("Could not delete team");
		}
	}

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
		} catch (error) {
			console.error("Error adding user to team:", error);
			throw new Error("Could not add user to team");
		}
	}

	async removeUserFromTeam(id: string, data: ManageTeamData): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/${id}/users`, { data });
		} catch (error) {
			console.error("Error removing user from team:", error);
			throw new Error("Could not remove user from team");
		}
	}

	async transferLeadership(id: string, data: ManageTeamData): Promise<void> {
		try {
			await axiosWithAuth.put(`${this.BASE_URL}/${id}/transfer-leader`, data);
		} catch (error) {
			console.error("Error transferring leadership:", error);
			throw new Error("Could not transfer leadership");
		}
	}

	async exitFromTeam(id: string): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/${id}/users/exit`);
		} catch (error) {
			console.error("Error exiting from team:", error);
			throw new Error("Could not exit from team");
		}
	}
}

export const teamService = new TeamService();
