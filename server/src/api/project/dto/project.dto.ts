import { AccessStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO for getting project details, optionally filtered by organization ID.
 */
export class GetProjectDto {
	/**
	 * The ID of the organization the project belongs to.
	 * This field is optional.
	 */
	@IsString()
	@IsOptional()
	organizationId: string;
}

/**
 * DTO for adding a user to a project.
 * This contains the ID of the user being added to the project.
 */
export class ManageProjectUserDto {
	/**
	 * The ID of the user to be added to the project.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	projectUserId: string;
}

/**
 * DTO for transferring manager to a project.
 * This contains the ID of the user being changed in manager to the project.
 */
export class TransferManagerDto {
	/**
	 * The ID of the user to be added to the project.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	newManagerId: string;
}

/**
 * DTO for updating the status of a user within a project.
 * This contains the project user ID and the new status to assign to the user.
 */
export class ProjectStatusDto {
	/**
	 * The ID of the user whose status within the project is being updated.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	projectUserId: string;

	/**
	 * The new status of the user within the project.
	 * This field must be an enum value of `AccessStatus` and is required.
	 * The value is automatically transformed to uppercase.
	 */
	@IsEnum(AccessStatus)
	@IsNotEmpty()
	@Transform(({ value }) => ('' + value).toUpperCase())
	projectStatus: AccessStatus;
}

/**
 * DTO for creating or updating a project.
 * This contains the necessary details for the project such as its title and description.
 */
export class ProjectDto {
	/**
	 * The ID of the organization to which the project belongs.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	organizationId: string;

	/**
	 * The ID of the projectManager to which the project belongs.
	 * This field is not required (as it can be added later).
	 */
	@IsString()
	@IsOptional()
	projectManagerId;

	/**
	 * The title of the project.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	title: string;

	/**
	 * A brief description of the project.
	 * This field is optional.
	 */
	@IsString()
	@IsOptional()
	description: string;
}
