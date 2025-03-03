import { axiosWithAuth } from "@/api/interceptors";
import type {
	ManageTeamUser,
	Team,
	TeamFormData,
	TeamResponse,
	TeamRole,
	TeamsProjectResponse,
	TeamsResponse,
	TeamUsersResponse,
} from "@/types/team.types";
import { toast } from "sonner";

/**
 * @class TeamService
 *
 * Service for managing teams and related actions within an organization.
 * It provides methods to fetch, create, update, delete teams, and manage users within teams.
 *
 * Methods:
 * - `getUserTeams`: Fetches teams associated with the current user.
 * - `getAllTeamUsers`: Fetches all users associated with a specific team.
 * - `getAllTeams`: Fetches all teams for a specific organization, with optional project filtering.
 * - `getAllTeamsByProject`: Fetches all teams for a specific project within an organization.
 * - `getTeamById`: Fetches a team by its ID.
 * - `getTeamRole`: Fetches the role of a specific user within a team.
 * - `createTeam`: Creates a new team with the provided data.
 * - `updateTeam`: Updates an existing team by its ID with new data.
 * - `updateTeamStatus`: Updates the status of a user within a team.
 * - `deleteTeam`: Deletes a team by its ID, associating it with an organization ID.
 * - `linkToProject`: Links a team to a project.
 * - `unlinkFromProject`: Unlinks a team from a project.
 * - `addUserToTeam`: Adds a user to a team.
 * - `removeUserFromTeam`: Removes a user from a team.
 *
 * Error handling is included with appropriate toast notifications and error logging.
 *
 * Example usage:
 * @example
 * const teams = await teamService.getUserTeams();
 * const users = await teamService.getAllTeamUsers({ organizationId: "org123", id: "team123" });
 * const newTeam = await teamService.createTeam({ name: "New Team", description: "Team description" });
 * const updatedTeam = await teamService.updateTeam("team123", { name: "Updated Team" });
 * const deleteResponse = await teamService.deleteTeam("team123", "org123");
 */
class TeamService {
	private BASE_URL = "/user/organizations/teams";

	/**
	 * Fetches teams associated with the current user.
	 * @returns A list of teams with their users.
	 * @example
	 * const teams = await teamService.getUserTeams();
	 */
	async getUserTeams(organizationId: string): Promise<TeamsResponse[]> {
		try {
			const response = await axiosWithAuth.get<TeamsResponse[]>(
				`${this.BASE_URL}/user-teams?organizationId=${organizationId}`
			);
			return response.data;
		} catch (error: any) {
			this.handleError("Error fetching user teams:", error);
			throw new Error("Could not fetch user teams");
		}
	}

	/**
	 * Fetches all users associated with a specific team.
	 * @param organizationId - The organization ID.
	 * @param id - The team ID.
	 * @returns A list of users from the team.
	 * @example
	 * const users = await teamService.getAllTeamUsers({ organizationId: 'org123', id: 'team123' });
	 */
	async getAllTeamUsers({
		organizationId,
		id,
	}: {
		organizationId: string;
		id: string;
	}): Promise<TeamUsersResponse[]> {
		try {
			const response = await axiosWithAuth.get<TeamUsersResponse[]>(
				`${this.BASE_URL}/${id}/users/?organizationId=${organizationId}`
			);
			return response.data;
		} catch (error: any) {
			this.handleError("Error fetching users from team:", error);
			throw new Error("Could not fetch users from team");
		}
	}

	/**
	 * Fetches all teams for a specific organization.
	 * @param organizationId - The organization ID.
	 * @param projectId - The project ID (optional).
	 * @returns A list of teams with their users.
	 * @example
	 * const teams = await teamService.getAllTeams('org123', 'project123');
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
			return response.data;
		} catch (error: any) {
			this.handleError("Error fetching all teams:", error);
			throw new Error("Could not fetch all teams");
		}
	}

	/**
	 * Fetches all teams for a specific project within an organization.
	 * @param organizationId - The organization ID.
	 * @param projectId - The project ID.
	 * @returns A list of teams with their users.
	 * @example
	 * const teams = await teamService.getAllTeamsByProject('org123', 'project123');
	 */
	async getAllTeamsByProject(
		organizationId: string,
		projectId: string
	): Promise<TeamsProjectResponse> {
		try {
			const response = await axiosWithAuth.get<TeamsProjectResponse>(
				`${this.BASE_URL}/project/?organizationId=${organizationId}&projectId=${projectId}`
			);
			return response.data;
		} catch (error: any) {
			this.handleError("Error fetching all teams for project:", error);
			throw new Error("Could not fetch all teams for project");
		}
	}

	/**
	 * Fetches a specific team by its ID.
	 * @param id - The team ID.
	 * @param organizationId - The organization ID.
	 * @returns A team object with its users.
	 * @example
	 * const team = await teamService.getTeamById('team123', 'org123');
	 */
	async getTeamById(id: string, organizationId: string): Promise<Team> {
		try {
			const response = await axiosWithAuth.get<Team>(
				`${this.BASE_URL}/${id}?organizationId=${organizationId}`
			);
			return response.data;
		} catch (error: any) {
			this.handleError("Error fetching team by ID:", error);
			throw new Error("Could not fetch team by ID");
		}
	}

	/**
	 * Fetches the role of a specific user within a team.
	 * @param id - The team ID.
	 * @param organizationId - The organization ID.
	 * @returns The role of the user in the team.
	 * @example
	 * const role = await teamService.getTeamRole({ id: 'team123', organizationId: 'org123' });
	 */
	async getTeamRole({
		id,
		organizationId,
	}: {
		id: string;
		organizationId: string;
	}): Promise<{ role: TeamRole }> {
		try {
			const response = await axiosWithAuth.get<{ role: TeamRole }>(
				`${this.BASE_URL}/${id}/role/?organizationId=${organizationId}`
			);
			return response.data;
		} catch (error: any) {
			// this.handleError("Error fetching team role:", error);
			throw new Error("Fetching organization failed");
		}
	}

	/**
	 * Creates a new team.
	 * @param data - Team form data.
	 * @returns The newly created team.
	 * @example
	 * const newTeam = await teamService.createTeam(teamFormData);
	 */
	async createTeam(data: TeamFormData): Promise<TeamsResponse> {
		try {
			const response = await axiosWithAuth.post<TeamsResponse>(
				this.BASE_URL,
				data
			);
			return response.data;
		} catch (error: any) {
			this.handleError("Error creating team:", error);
			throw new Error("Could not create team");
		}
	}

	/**
	 * Updates an existing team.
	 * @param id - The team ID.
	 * @param data - Updated team form data.
	 * @param organizationId - The organization ID to associate with the update.
	 * @returns The updated team.
	 * @example
	 * const updatedTeam = await teamService.updateTeam('team123', updatedTeamData);
	 */
	async updateTeam(
		id: string,
		data: TeamFormData,
		organizationId: string
	): Promise<TeamResponse> {
		try {
			const response = await axiosWithAuth.put<TeamResponse>(
				`${this.BASE_URL}/${id}/?organizationId=${organizationId}`,
				data
			);
			return response.data;
		} catch (error: any) {
			this.handleError("Error updating team:", error);
			throw new Error("Could not update team");
		}
	}

	/**
	 * Updates the status of a user within a team.
	 * @param id - The team ID.
	 * @param data - Data to update the user status.
	 * @returns The updated user team data.
	 * @example
	 * const updatedUser = await teamService.updateTeamStatus({ id: 'team123', ...userData });
	 */
	async updateTeamStatus({
		id,
		...data
	}: ManageTeamUser): Promise<TeamUsersResponse> {
		try {
			const response = await axiosWithAuth.put<TeamUsersResponse>(
				`${this.BASE_URL}/${id}/update-status`,
				data
			);
			return response.data;
		} catch (error: any) {
			this.handleError("Error updating team status:", error);
			throw new Error("Could not update team");
		}
	}

	/**
	 * Deletes a team.
	 * @param id - The team ID.
	 * @param organizationId - The organization ID.
	 * @example
	 * await teamService.deleteTeam('team123', 'org123');
	 */
	async deleteTeam(id: string, organizationId: string): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/${id}`, {
				data: { organizationId },
			});
		} catch (error: any) {
			this.handleError("Error deleting team:", error);
			throw new Error("Could not delete team");
		}
	}

	/**
	 * Links a team to a project.
	 * @param id - The team ID.
	 * @param projectId - The project ID.
	 * @param organizationId - The organization ID.
	 * @returns The updated team.
	 * @example
	 * const updatedTeam = await teamService.linkToProject({ id: 'team123', projectId: 'proj123', organizationId: 'org123' });
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
			this.handleError("Error linking team to project:", error);
			throw new Error("Could not link team to project");
		}
	}

	/**
	 * Unlinks a team from a project.
	 * @param id - The team ID.
	 * @param projectId - The project ID.
	 * @param organizationId - The organization ID.
	 * @example
	 * const updatedTeam = await teamService.unlinkFromProject({ id: 'team123', projectId: 'proj123', organizationId: 'org123' });
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
			this.handleError("Error unlinking team to project:", error);
			throw new Error("Could not unlink team to project");
		}
	}

	/**
	 * Adds a user to a team.
	 * @param id - The team ID.
	 * @param data - Data about the user to add.
	 * @returns The updated team with its users.
	 * @example
	 * const updatedTeam = await teamService.addUserToTeam({ id: 'team123', ...userData });
	 */
	async addUserToTeam({
		id,
		...data
	}: ManageTeamUser): Promise<TeamUsersResponse> {
		try {
			const response = await axiosWithAuth.post<TeamUsersResponse>(
				`${this.BASE_URL}/${id}/users`,
				data
			);
			return response.data;
		} catch (error: any) {
			this.handleError("Error adding user to team:", error);
			throw new Error("Could not add user to team");
		}
	}

	/**
	 * Removes a user from a team.
	 * @param id - The team ID.
	 * @param data - Data about the user to remove.
	 * @example
	 * const updatedTeam = await teamService.removeUserFromTeam({ id: 'team123', ...userData });
	 */
	async removeUserFromTeam({
		id,
		...data
	}: ManageTeamUser): Promise<TeamUsersResponse> {
		try {
			return await axiosWithAuth.delete(`${this.BASE_URL}/${id}/users`, {
				data,
			});
		} catch (error: any) {
			this.handleError("Error removing user from team:", error);
			throw new Error("Could not remove user from team");
		}
	}

	/**
	 * Transfers leadership within a team.
	 * @param id - The team ID.
	 * @param data - Data about the new leader.
	 * @example
	 * const updatedTeam = await teamService.transferLeadership({ id: 'team123', ...leadershipData });
	 */
	async transferLeadership({
		id,
		...data
	}: ManageTeamUser): Promise<TeamUsersResponse> {
		try {
			return await axiosWithAuth.put(
				`${this.BASE_URL}/${id}/transfer-leader`,
				data
			);
		} catch (error: any) {
			this.handleError("Error transferring leadership:", error);
			throw new Error("Could not transfer leadership");
		}
	}

	/**
	 * Allows the current user to exit a team.
	 * @param id - The team ID.
	 * @example
	 * await teamService.exitFromTeam('team123');
	 */
	async exitFromTeam(id: string): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/${id}/users/exit`);
		} catch (error: any) {
			this.handleError("Error exiting from team:", error);
			throw new Error("Could not exit from team");
		}
	}

	/**
	 * Handles errors and displays toast notifications.
	 * @param message - The error message to display.
	 * @param error - The error object.
	 */
	private handleError(message: string, error: any): void {
		console.error(message, error);
		toast.error(error?.response?.data?.message || "Something went wrong.");
	}
}

export const teamService = new TeamService();
