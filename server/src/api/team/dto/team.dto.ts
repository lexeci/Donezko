import { AccessStatus, TeamRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * LinkTeamToProjectDto - Data Transfer Object for assigning a team to a project.
 *
 * This class ensures that the projectId and organizationId are provided.
 * It allows linking a team to a specific project and organization.
 */
export class LinkTeamToProjectDto {
	/**
	 * The ID of the project to get teams for.
	 *
	 * This field is required and represents the unique identifier of the project.
	 * It is used to link the team to the project.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "projectId": "proj123" }
	 * // Represents the project with ID "proj123"
	 */
	@IsNotEmpty()
	@IsString()
	projectId: string;

	/**
	 * The ID of the organization to get teams for.
	 *
	 * This field is required and represents the unique identifier of the organization.
	 * It ensures that the team is linked to the correct organization.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization with ID "org123"
	 */
	@IsNotEmpty()
	@IsString()
	organizationId: string;
}

/**
 * CreateTeamDto - Data Transfer Object for creating a new team.
 *
 * This class ensures that the organizationId, projectId, and title are provided.
 * The description is optional for providing additional information about the team.
 */
export class CreateTeamDto {
	/**
	 * The ID of the organization that the team belongs to.
	 *
	 * This field is required and represents the unique identifier of the organization.
	 * It ensures that the new team is created within the correct organization.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization with ID "org123"
	 */
	@IsNotEmpty()
	@IsString()
	organizationId: string;

	/**
	 * The ID of the new leader of the team.
	 *
	 * This field is required and represents the unique identifier of the team's leader.
	 * It ensures that the correct person is assigned as the team leader.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "teamLeaderId": "user123" }
	 * // Represents the leader with ID "user123"
	 */
	@IsNotEmpty()
	@IsString()
	teamLeaderId: string;

	/**
	 * The title/name of the team.
	 *
	 * This field is required and represents the name of the team.
	 * It is used to uniquely identify the team.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "title": "Tech Team" }
	 * // Represents the team titled "Tech Team"
	 */
	@IsNotEmpty()
	@IsString()
	title: string;

	/**
	 * An optional description of the team.
	 *
	 * This field provides additional information about the team's purpose or mission.
	 * It is not mandatory to fill out.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "description": "A team focused on developing tech solutions." }
	 * // Represents a brief description of the team
	 */
	@IsOptional()
	@IsString()
	description: string;
}

/**
 * UpdateTeamDto - Data Transfer Object for updating an existing team.
 *
 * This class ensures that the team ID, organizationId, and projectId are provided.
 * The title and description are optional and can be updated if needed.
 */
export class UpdateTeamDto {
	/**
	 * The ID of the team to update.
	 *
	 * This field is required and represents the unique identifier of the team.
	 * It is used to locate the team that needs to be updated.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "id": "team123" }
	 * // Represents the team with ID "team123"
	 */
	@IsNotEmpty()
	@IsString()
	id: string;

	/**
	 * The ID of the organization the team belongs to.
	 *
	 * This field is required and ensures that the team is updated in the correct organization.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization with ID "org123"
	 */
	@IsNotEmpty()
	@IsString()
	organizationId: string;

	/**
	 * The ID of the project the team belongs to.
	 *
	 * This field is required and ensures that the team is correctly linked to the project.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "projectId": "proj123" }
	 * // Represents the project with ID "proj123"
	 */
	@IsNotEmpty()
	@IsString()
	projectId: string;

	/**
	 * An optional new title for the team.
	 *
	 * This field allows updating the title of the team if necessary.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "title": "Updated Tech Team" }
	 * // Represents the updated title of the team
	 */
	@IsOptional()
	@IsString()
	title: string;

	/**
	 * An optional new description for the team.
	 *
	 * This field allows updating the description of the team if necessary.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "description": "A team focused on cutting-edge tech solutions." }
	 * // Represents the updated description of the team
	 */
	@IsOptional()
	@IsString()
	description: string;
}

/**
 * DeleteTeamDto - Data Transfer Object for deleting a team.
 *
 * This class ensures that the organizationId and projectId are provided for deletion.
 */
export class DeleteTeamDto {
	/**
	 * The ID of the organization the team belongs to.
	 *
	 * This field is required and represents the unique identifier of the organization.
	 * It ensures that the correct organization is targeted for team deletion.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization with ID "org123"
	 */
	@IsNotEmpty()
	@IsString()
	organizationId: string;

	/**
	 * The ID of the project the team belongs to.
	 *
	 * This field is optional and represents the unique identifier of the project.
	 * It is used to delete the team from a specific project, if provided.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "projectId": "proj123" }
	 * // Represents the project with ID "proj123"
	 */
	@IsOptional()
	@IsString()
	projectId: string;
}

/**
 * ManageTeamDto - Data Transfer Object for managing team members (adding/removing users, changing roles).
 *
 * This class allows manipulation of team membership and roles within the organization.
 * It includes fields for adding/removing users, changing their roles, and updating their statuses.
 */
export class ManageTeamDto {
	/**
	 * The team ID.
	 *
	 * This field is optional and represents the unique identifier of the team.
	 * It is used to manipulate team membership and roles.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "id": "team123" }
	 * // Represents the team with ID "team123"
	 */
	@IsNotEmpty()
	@IsOptional()
	id: string;

	/**
	 * The ID of the organization the team belongs to.
	 *
	 * This field is required and represents the unique identifier of the organization.
	 * It ensures that the team is correctly associated with the organization.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization with ID "org123"
	 */
	@IsNotEmpty()
	@IsString()
	organizationId: string;

	/**
	 * The ID of the project the team belongs to.
	 *
	 * This field is optional and represents the unique identifier of the project.
	 * If provided, it will target a specific project for the team.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "projectId": "proj123" }
	 * // Represents the project with ID "proj123"
	 */
	@IsOptional()
	@IsString()
	projectId: string;

	/**
	 * The ID of the user to add or remove from the team.
	 *
	 * This field is optional and represents the unique identifier of the user.
	 * If provided, the user will be added to or removed from the team.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "teamUserId": "user123" }
	 * // Represents the user with ID "user123"
	 */
	@IsOptional()
	@IsString()
	teamUserId: string;

	/**
	 * The role of the user in the team.
	 *
	 * This field is optional and represents the role of the user in the team.
	 * The value is automatically transformed to uppercase for consistency.
	 *
	 * @type {TeamRole}
	 * @optional
	 *
	 * @example
	 * { "role": "LEADER" }
	 * // Represents the user with the role "LEADER"
	 */
	@IsEnum(TeamRole)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	role: TeamRole;

	/**
	 * The status of the user in the team.
	 *
	 * This field is optional and represents the user's status in the team.
	 * The value is automatically transformed to uppercase for consistency.
	 *
	 * @type {AccessStatus}
	 * @optional
	 *
	 * @example
	 * { "teamStatus": "ACTIVE" }
	 * // Represents the user with the status "ACTIVE"
	 */
	@IsEnum(AccessStatus)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	teamStatus: AccessStatus;
}

/**
 * TeamDto - Data Transfer Object representing a team and its associated user/team details.
 *
 * This class provides a flexible representation of teams with optional fields.
 * It includes optional fields for team ID, user ID, organization ID, project ID, title, and description.
 */
export class TeamDto {
	/**
	 * The team ID.
	 *
	 * This field is optional and represents the unique identifier of the team.
	 * It is used to identify the specific team being managed.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "id": "team123" }
	 * // Represents the team with ID "team123"
	 */
	@IsString()
	@IsOptional()
	id: string;

	/**
	 * The user ID associated with the team.
	 *
	 * This field is optional and represents the unique identifier of the user associated with the team.
	 * It is used to manage user-team relationships.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "userId": "user123" }
	 * // Represents the user with ID "user123"
	 */
	@IsString()
	@IsOptional()
	userId: string;

	/**
	 * The organization ID the team belongs to.
	 *
	 * This field is optional and represents the unique identifier of the organization.
	 * It is used to link the team to the organization.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization with ID "org123"
	 */
	@IsString()
	@IsOptional()
	organizationId: string;

	/**
	 * The project ID the team is working on.
	 *
	 * This field is optional and represents the unique identifier of the project.
	 * It is used to link the team to the project.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "projectId": "proj123" }
	 * // Represents the project with ID "proj123"
	 */
	@IsString()
	@IsOptional()
	projectId: string;

	/**
	 * The title of the team.
	 *
	 * This field is optional and represents the name of the team.
	 * It helps to identify the team within the organization or project.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "title": "Tech Team" }
	 * // Represents the team titled "Tech Team"
	 */
	@IsString()
	@IsOptional()
	title: string;

	/**
	 * An optional description of the team.
	 *
	 * This field provides additional context or information about the team's purpose or mission.
	 * It is not mandatory to fill out.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "description": "A team focused on developing tech solutions." }
	 * // Represents a brief description of the team
	 */
	@IsString()
	@IsOptional()
	description: string;
}
