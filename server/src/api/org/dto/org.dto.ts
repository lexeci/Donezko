import { AccessStatus, OrgRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO for getting project details, optionally filtered by organization ID.
 */
export class GetOrgDto {
	/**
	 * The ID of the organization the project belongs to.
	 * This field is optional.
	 */
	@IsString()
	@IsOptional()
	organizationId: string;
}
/**
 * DTO for managing a user within an organization.
 */
export class ManageOrgUserDto {
	/**
	 * The ID of the user within the organization.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	orgUserId: string;

	/**
	 * The role of the user within the organization.
	 * This field is optional.
	 * The value is automatically transformed to uppercase.
	 */
	@IsEnum(OrgRole)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	role: OrgRole;

	/**
	 * The status of the user within the organization.
	 * This field is optional.
	 * The value is automatically transformed to uppercase.
	 */
	@IsEnum(AccessStatus)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	organizationStatus: AccessStatus;
}

/**
 * DTO for transferring ownership of the organization to another user.
 */
export class TransferOrgOwnerDto {
	/**
	 * The ID of the user to whom the ownership will be transferred.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	orgUserId: string;
}

/**
 * DTO for joining an organization using a join code.
 */
export class JoinOrgDto {
	/**
	 * The title of the organization to join.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	title: string;

	/**
	 * The join code required to join the organization.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	joinCode: string;
}

/**
 * DTO for creating or updating an organization.
 */
export class OrgDto {
	/**
	 * The title of the organization.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	title: string;

	/**
	 * A brief description of the organization.
	 * This field is optional.
	 */
	@IsString()
	@IsOptional()
	description: string;

	/**
	 * The join code for the organization.
	 * This field is required.
	 */
	@IsString()
	@IsNotEmpty()
	joinCode: string;
}
