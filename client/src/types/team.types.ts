// Importing types related to authentication users, organizations, teams, and tasks
import {AuthUser} from "./auth.types"; // Types related to authenticated users
import {Organization} from "./org.types"; // Types related to organizations
import {ProjectTeam} from "./project.types"; // Types related to project teams
import {AccessStatus, RootBase, UUID} from "./root.types"; // General types for access, root types, and UUID
import {TaskResponse} from "./task.types"; // Types related to tasks

// Enum representing possible roles within a team
export enum TeamRole {
    LEADER = "LEADER", // Team leader role
    MEMBER = "MEMBER", // Team member role
}

/**
 * Interface representing a user within a team.
 * This interface includes the user's ID, role, access status, and user details like name and email.
 */
interface teamUser {
    id: UUID; // Unique identifier for the user
    role: TeamRole; // The role of the user within the team
    teamStatus: AccessStatus; // Access status of the user within the team
    user: {
        id: UUID; // Unique identifier for the user
        name: string; // Name of the user
        email: string; // Email of the user
    };
}

/**
 * Type for managing a team user.
 * It includes options to set the user's role, team status, and other optional fields.
 */
export type ManageTeamUser = {
    id: UUID; // Unique identifier for the record
    userId?: UUID; // The user's identifier (optional)
    teamStatus?: AccessStatus; // The user's access status within the team (optional)
    role?: TeamRole; // The user's role within the team (optional)
    organizationId?: UUID; // Organization ID (optional)
    projectId?: UUID; // Project ID (optional)
    teamUserId?: UUID; // Team user ID (optional)
};

/**
 * Response type for a request about team users.
 * It includes the role, team ID, user information, and access status within the team.
 */
export interface TeamUsersResponse extends RootBase {
    role: TeamRole; // The role of the user in the team
    teamId: string; // The team ID
    teamStatus?: AccessStatus; // The access status within the team
    user: AuthUser; // Information about the user
    userId: string; // The user's ID
}

/**
 * Interface representing a team.
 * Includes team details like title, description, associated project, tasks, and team users.
 */
export interface Team extends RootBase {
    title: string; // Name of the team
    description: string; // Description of the team
    organizationId: UUID; // Organization ID
    organization: Organization; // The organization the team belongs to
    projectId: UUID; // Project ID the team is associated with
    tasks: TaskResponse[]; // Tasks associated with the team
    teamUsers?: Array<{
        userid: UUID; // User ID
        id: UUID; // Unique ID of the user in the team
        role: TeamRole; // The role of the user in the team
        teamStatus: AccessStatus; // The user's access status within the team
        user: {
            id: UUID; // User ID
            name: string; // User's name
            email: string; // User's email
        };
    }>;
    projectTeams: ProjectTeam[]; // Project teams associated with this team
    _count?: {
        teamUsers: number; // Number of users in the team
        tasks: number; // Number of tasks in the team
    };
}

/**
 * Response type for a team request with team details.
 * Includes team data along with the role and access status of the user in the team.
 */
export interface TeamResponse extends RootBase {
    teamId: string; // Team ID
    role: TeamRole; // The role of the user in the team
    teamStatus: AccessStatus; // The user's access status within the team
    team: Team; // The team data
}

/**
 * Response type for a list of teams.
 * Includes team title, description, team users, and counts for users and tasks.
 */
export interface TeamsResponse extends RootBase {
    title: string; // The team's title
    description: string; // The team's description
    organizationId: string; // The organization's ID
    teamUsers: teamUser[]; // List of users in the team
    _count: {
        teamUsers: true; // Count of users in the team
        tasks: true; // Count of tasks in the team
    };
}

/**
 * Response type for teams within a project.
 * Differentiates teams that are part of the project from those that are not.
 */
export interface TeamsProjectResponse {
    inProject: TeamsResponse[]; // Teams that are part of the project
    notInProject: TeamsResponse[]; // Teams that are not part of the project
}

/**
 * Response type for a team with users.
 * Combines team details with a list of users in the team.
 */
export interface TeamWithUsersResponse extends TeamResponse {
    teamUsers: teamUser[]; // List of users in the team
}

/**
 * Type for team creation or update form data.
 * Includes team leader ID and excludes certain fields like id and updatedAt.
 */
export type TeamFormData = Partial<
    Omit<Team, "id" | "updatedAt" | "updatedAt"> & { teamLeaderId: string }
>;
