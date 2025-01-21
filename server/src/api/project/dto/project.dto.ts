import { AccessStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * ManageProjectUserDto - Data Transfer Object for adding a user to a project.
 *
 * This class defines the structure for adding a user to a project by specifying the user's ID.
 */
export class ManageProjectUserDto {
	/**
	 * The ID of the user to be added to the project.
	 *
	 * This field is required and represents the unique identifier of the user.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "projectUserId": "user123" }
	 * // Represents the user with ID "user123" to be added to the project
	 */
	@IsString()
	@IsNotEmpty()
	projectUserId: string;
}

/**
 * TransferManagerDto - Data Transfer Object for transferring the project manager role.
 *
 * This class defines the structure for changing the project manager by specifying the new manager's ID.
 */
export class TransferManagerDto {
	/**
	 * The ID of the user to be assigned as the new project manager.
	 *
	 * This field is required and represents the unique identifier of the new manager.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "newManagerId": "manager123" }
	 * // Represents the user with ID "manager123" who will be the new manager of the project
	 */
	@IsString()
	@IsNotEmpty()
	newManagerId: string;
}

/**
 * ProjectStatusDto - Data Transfer Object for updating the status of a user within a project.
 *
 * This class defines the structure for updating a user's status within a project,
 * including the project user ID and the new status.
 */
export class ProjectStatusDto {
	/**
	 * The ID of the user whose status within the project is being updated.
	 *
	 * This field is required and represents the unique identifier of the project user.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "projectUserId": "user123" }
	 * // Represents the user with ID "user123" whose status is being updated
	 */
	@IsString()
	@IsNotEmpty()
	projectUserId: string;

	/**
	 * The new status of the user within the project.
	 *
	 * This field must be an enum value of `AccessStatus` and is required.
	 * The value is automatically transformed to uppercase.
	 *
	 * @type {AccessStatus}
	 * @required
	 *
	 * @example
	 * { "projectStatus": "ACTIVE" }
	 * // Represents the new status of the user as "ACTIVE"
	 */
	@IsEnum(AccessStatus)
	@IsNotEmpty()
	@Transform(({ value }) => ('' + value).toUpperCase())
	projectStatus: AccessStatus;
}

/**
 * ProjectDto - Data Transfer Object for creating or updating a project.
 *
 * This class defines the structure for creating or updating project details,
 * including the organization ID, project manager ID, title, and description.
 */
export class ProjectDto {
	/**
	 * The ID of the organization to which the project belongs.
	 *
	 * This field is required and represents the unique identifier of the organization.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "organizationId": "org123" }
	 * // Represents the organization with ID "org123" to which the project belongs
	 */
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	/**
	 * The ID of the project manager.
	 *
	 * This field is optional and represents the unique identifier of the project manager.
	 * It can be added or updated later.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "projectManagerId": "manager123" }
	 * // Represents the project manager with ID "manager123"
	 */
	@IsString()
	@IsOptional()
	projectManagerId;

	/**
	 * The title of the project.
	 *
	 * This field is required and represents the name of the project.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "title": "Tech Project" }
	 * // Represents the project titled "Tech Project"
	 */
	@IsString()
	@IsNotEmpty()
	title: string;

	/**
	 * A brief description of the project.
	 *
	 * This field is optional and provides additional information about the project.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "description": "A project focused on technology." }
	 * // Represents a brief description of the project
	 */
	@IsString()
	@IsOptional()
	description: string;
}
