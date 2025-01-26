import { AuthUser } from "./auth.types";
import { Project } from "./project.types";
import type { AccessStatus, RootBase, UUID } from "./root.types";
import { TaskResponse } from "./task.types";
import { TeamsResponse } from "./team.types";

// Enum defining roles within an organization
export enum OrgRole {
	OWNER = "OWNER", // The owner of the organization with full control
	ADMIN = "ADMIN", // An admin with high-level privileges within the organization
	MEMBER = "MEMBER", // A member who has access to specific resources but with limited privileges
	VIEWER = "VIEWER", // A viewer with read-only access to the organization's resources
}

/**
 * Type representing the request to join an organization.
 * It includes the title of the organization and the join code required for access.
 */
export type JoinOrgType = {
	title: string; // Title of the organization the user wants to join
	joinCode: string; // The code required to join the organization
};

/**
 * Type for managing users within the organization.
 * It includes the user ID, relationship ID, role, and the status of the user in the organization.
 */
export type ManageOrgUser = {
	id: string; // The ID of the user being managed
	orgUserId: string; // The ID of the organization user relationship
	role?: OrgRole; // The role to assign to the user (e.g., OWNER, ADMIN)
	organizationStatus?: AccessStatus; // The status of the user in the organization (e.g., ACTIVE or BANNED)
};

/**
 * Interface representing the "Organization" entity with basic properties.
 * It includes the organization title, description, join code, users, teams, and projects.
 */
export interface Organization extends RootBase {
	title: string; // The title/name of the organization
	description?: string; // An optional description providing details about the organization
	joinCode?: string; // An optional join code for adding users to the organization
	organizationUsers?: OrgUserResponse[]; // A list of users belonging to the organization
	organizationId?: UUID; // The unique ID of the organization
	projects?: Project[]; // A list of projects within the organization
	teams?: TeamsResponse[]; // A list of teams associated with the organization
	tasks?: TaskResponse[]; // Tasks associated with the organization
	_count?: {
		organizationUsers: number; // The number of users in the organization
		teams: number; // The number of teams in the organization
		projects: number; // The number of projects within the organization
	};
}

/**
 * Interface representing the response for a specific organization,
 * including the user's role and status in the organization.
 */
export interface OrgResponse {
	organization: Organization; // The organization object
	role?: OrgRole; // The role of the user in the organization (e.g., OWNER, ADMIN)
	organizationStatus?: AccessStatus; // The status of the user in the organization (e.g., ACTIVE or BANNED)
}

/**
 * Interface representing a user within an organization.
 * Includes the user's role, status, and their associated organization.
 */
export interface OrgUserResponse extends RootBase {
	userId: UUID; // The unique ID of the user
	organizationId: UUID; // The unique ID of the organization
	organizationStatus: AccessStatus; // The status of the user in the organization (e.g., ACTIVE or BANNED)
	role: OrgRole; // The role of the user in the organization (e.g., OWNER, ADMIN, MEMBER, VIEWER)
	user: AuthUser; // The user object representing the individual
	organization: Organization; // The organization object to which the user belongs
}

/**
 * Type for creating or updating an organization.
 * Excludes fields like ID and updated timestamps.
 */
export type OrgFormData = Partial<Omit<Organization, "id" | "updatedAt">>;

/**
 * Type for creating or updating an organization user.
 * Excludes fields like ID and updated timestamps.
 */
export type OrgUserFormData = Partial<
	Omit<OrgUserResponse, "id" | "updatedAt">
>;
