import { AccessStatus, TeamRole } from '@prisma/client';

/**
 * TeamWithUsers - Represents a structure that includes team users and their associated data.
 *
 * This type defines a relationship between a team and its users, where each user within the team has
 * certain information, such as their status, role, and timestamps for when they were created or updated in the system.
 *
 * The structure contains the following properties:
 *
 * - **teamUsers**: An array of objects representing users who are part of the team. Each object in the array includes the following properties:
 *   - **id** (string): A unique identifier for the record of the user in the team.
 *   - **createdAt** (Date): The timestamp when the user was added to the team.
 *   - **updatedAt** (Date): The timestamp when the user’s status or role was last updated.
 *   - **teamId** (string): The identifier of the team that the user is part of.
 *   - **teamStatus** (AccessStatus): The current status of the user’s access to the team, e.g., active or inactive.
 *   - **role** (TeamRole): The role of the user within the team, e.g., member, leader, etc.
 *   - **userId** (string): The unique identifier for the user in the system.
 *
 * This type is useful for managing team membership, roles, and access levels, providing the structure to handle user data
 * within specific teams in the application.
 */
export type TeamWithUsers = {
	teamUsers: {
		id: string; // Unique identifier for the team user record
		createdAt: Date; // Timestamp when the user was added to the team
		updatedAt: Date; // Timestamp when the user's details were last updated
		teamId: string; // The identifier of the team the user is part of
		teamStatus: AccessStatus; // The current access status of the user in the team
		role: TeamRole; // The role of the user in the team (e.g., leader, member)
		userId: string; // Unique identifier for the user
	}[];
};
