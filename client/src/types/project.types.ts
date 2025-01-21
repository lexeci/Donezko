import {AuthUser} from "./auth.types";
import {Organization, OrgUserResponse} from "./org.types";
import type {AccessStatus, RootBase, UUID} from "./root.types";
import {TaskResponse} from "./task.types";
import {Team} from "./team.types";

// Enum defining different roles for project users
export enum ProjectRole {
    MEMBER = "MEMBER", // Regular member role
    MANAGER = "MANAGER", // Manager role with higher privileges
}

/**
 * Interface representing the "Project" entity.
 * It includes project details such as title, description, and related tasks or teams.
 */
export interface Project extends RootBase {
    title: string; // The title/name of the project
    description: string; // A description providing details about the project
    organizationId?: UUID; // Optional organization ID to which the project belongs
    organization?: Organization; // Optional organization object for the project
    tasks?: TaskResponse[]; // Optional list of tasks within the project
    projectTeams?: ProjectTeam[]; // Optional list of teams associated with the project
    _count?: {
        projectUsers: number; // Number of users in the project
        projectTeams: number; // Number of teams in the project
        tasks: number; // Number of tasks associated with the project
    };
}

/**
 * Interface representing a user in the project.
 * It includes the user’s role and status in the project (e.g., active or banned).
 */
export interface ProjectUsers extends RootBase {
    userId: UUID; // The unique ID of the user
    user: AuthUser; // The user object containing details about the user
    projectStatus: AccessStatus; // The user's access status (active or banned) in the project
    role: ProjectRole; // The user's role in the project (e.g., Manager or Member)
}

/**
 * Interface for the response when retrieving project information.
 * It includes details about the project and the user's role within the project.
 */
export interface ProjectResponse extends RootBase {
    projectId: UUID; // The unique identifier for the project
    projectStatus: AccessStatus; // The status of the project (active or inactive)
    role: ProjectRole; // The role of the user in the project
    project: Project; // The project object containing the project details
    userId: UUID; // The user ID of the person requesting the project
    user: {
        organizationUsers: OrgUserResponse[]; // List of users in the organization associated with the project
    };
}

/**
 * Interface representing the "ProjectTeam" entity.
 * It links a project to a specific team, representing the connection between both entities.
 */
export interface ProjectTeam extends RootBase {
    projectId: UUID; // The unique identifier for the project
    teamId: UUID; // The unique identifier for the team
    project: Project; // The associated project object
    team: Team; // The associated team object
}

/**
 * Type for the form data when creating or updating a project.
 * It excludes the 'id' and 'updatedAt' fields, and adds 'projectManagerId' for the manager of the project.
 */
export type ProjectFormData = Partial<
    Omit<Project, "id" | "updatedAt"> & { projectManagerId: string } // Exclude 'id' and 'updatedAt' fields, and add 'projectManagerId'
>;

/**
 * Type for the form data when creating or updating a project team.
 * It excludes the 'id' and 'updatedAt' fields.
 */
export type ProjectTeamFormData = Partial<
    Omit<ProjectTeam, "id" | "updatedAt"> // Exclude 'id' and 'updatedAt' fields
>;
