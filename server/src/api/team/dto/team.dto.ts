import { AccessStatus, TeamRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO for getting a team by project and organization IDs.
 * It ensures that the projectId and organizationId are provided.
 */
export class GetTeamDto {
	@IsNotEmpty()
	@IsString()
	projectId: string; // The ID of the project to get teams for.

	@IsNotEmpty()
	@IsString()
	organizationId: string; // The ID of the organization to get teams for.
}

/**
 * DTO for creating a new team.
 * It ensures that organizationId, projectId, and title are provided.
 * Description is optional.
 */
export class CreateTeamDto {
	@IsNotEmpty()
	@IsString()
	organizationId: string; // The ID of the organization that the team belongs to.

	@IsNotEmpty()
	@IsString()
	projectId: string; // The ID of the project the team belongs to.

	@IsNotEmpty()
	@IsString()
	title: string; // The title/name of the team.

	@IsOptional()
	@IsString()
	description: string; // Optional description of the team.
}

/**
 * DTO for updating an existing team.
 * It ensures that id, organizationId, projectId are provided.
 * Title and description are optional for updates.
 */
export class UpdateTeamDto {
	@IsNotEmpty()
	@IsString()
	id: string; // The ID of the team to update.

	@IsNotEmpty()
	@IsString()
	organizationId: string; // The ID of the organization the team belongs to.

	@IsNotEmpty()
	@IsString()
	projectId: string; // The ID of the project the team belongs to.

	@IsOptional()
	@IsString()
	title: string; // Optional new title for the team.

	@IsOptional()
	@IsString()
	description: string; // Optional new description for the team.
}

/**
 * DTO for deleting a team.
 * It ensures that organizationId and projectId are provided.
 */
export class DeleteTeamDto {
	@IsNotEmpty()
	@IsString()
	organizationId: string; // The ID of the organization the team belongs to.

	@IsNotEmpty()
	@IsString()
	projectId: string; // The ID of the project the team belongs to.
}

/**
 * DTO for managing team members (adding/removing users, changing roles).
 * It allows manipulation of team membership and roles.
 */
export class ManageTeamDto {
	@IsNotEmpty()
	@IsOptional()
	id: string; // The team ID.

	@IsNotEmpty()
	@IsString()
	organizationId: string; // The ID of the organization the team belongs to.

	@IsNotEmpty()
	@IsString()
	projectId: string; // The ID of the project the team belongs to.

	@IsOptional()
	@IsString()
	teamUserId: string; // The ID of the user to add or remove from the team.

	@IsEnum(TeamRole)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase()) // Transform value to uppercase for TeamRole enum
	role: TeamRole; // The role of the user in the team (e.g., LEADER, MEMBER).

	@IsEnum(AccessStatus)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase()) // Transform value to uppercase for AccessStatus enum
	teamStatus: AccessStatus; // The status of the user in the team (e.g., ACTIVE, INACTIVE).
}

/**
 * DTO representing a team and its associated user/team details.
 * It is used for flexible representation of teams with optional fields.
 */
export class TeamDto {
	@IsString()
	@IsOptional()
	id: string; // The team ID.

	@IsString()
	@IsOptional()
	userId: string; // The user ID associated with the team.

	@IsString()
	@IsOptional()
	organizationId: string; // The organization ID the team belongs to.

	@IsString()
	@IsOptional()
	projectId: string; // The project ID the team is working on.

	@IsString()
	@IsOptional()
	title: string; // The title of the team.

	@IsString()
	@IsOptional()
	description: string; // Optional description of the team.
}
