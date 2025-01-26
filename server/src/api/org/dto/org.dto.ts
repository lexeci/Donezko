import { AccessStatus, OrgRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * GetOrgDto - Data Transfer Object for getting organization details.
 *
 * This class defines the structure for fetching organization-related information.
 * It optionally includes the organization ID to filter results based on a specific organization.
 */
export class GetOrgDto {
	/**
	 * The ID of the organization the project belongs to.
	 *
	 * This field is optional and represents the unique identifier of the organization.
	 * If provided, the results will be filtered by this organization ID.
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
}

/**
 * ManageOrgUserDto - Data Transfer Object for managing a user within an organization.
 *
 * This class defines the structure for updating a user's role and status within an organization.
 * It includes the user ID, role, and status.
 */
export class ManageOrgUserDto {
	/**
	 * The ID of the user within the organization.
	 *
	 * This field is required and represents the unique identifier of the user in the organization.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "orgUserId": "user123" }
	 * // Represents the user with ID "user123"
	 */
	@IsString()
	@IsNotEmpty()
	orgUserId: string;

	/**
	 * The role of the user within the organization.
	 *
	 * This field is optional and represents the user's role in the organization.
	 * The value is automatically transformed to uppercase.
	 *
	 * @type {OrgRole}
	 * @optional
	 *
	 * @example
	 * { "role": OrgRole.ADMIN }
	 * // Represents the user with the role Admin
	 */
	@IsEnum(OrgRole)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	role: OrgRole;

	/**
	 * The status of the user within the organization.
	 *
	 * This field is optional and represents the user's status in the organization.
	 * The value is automatically transformed to uppercase.
	 *
	 * @type {AccessStatus}
	 * @optional
	 *
	 * @example
	 * { "organizationStatus": "ACTIVE" }
	 * // Represents the user with the status "ACTIVE"
	 */
	@IsEnum(AccessStatus)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	organizationStatus: AccessStatus;
}

/**
 * TransferOrgOwnerDto - Data Transfer Object for transferring ownership of the organization.
 *
 * This class defines the structure for transferring the ownership of an organization to another user.
 */
export class TransferOrgOwnerDto {
	/**
	 * The ID of the user to whom the ownership will be transferred.
	 *
	 * This field is required and represents the unique identifier of the new owner.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "orgUserId": "user123" }
	 * // Represents the user with ID "user123" who will receive ownership
	 */
	@IsString()
	@IsNotEmpty()
	orgUserId: string;
}

/**
 * JoinOrgDto - Data Transfer Object for joining an organization using a join code.
 *
 * This class defines the structure for joining an organization by providing the organization title and join code.
 */
export class JoinOrgDto {
	/**
	 * The title of the organization to join.
	 *
	 * This field is required and represents the name of the organization the user wants to join.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "title": "Tech Group" }
	 * // Represents the organization titled "Tech Group"
	 */
	@IsString()
	@IsNotEmpty()
	title: string;

	/**
	 * The join code required to join the organization.
	 *
	 * This field is required and represents the unique code needed to access the organization.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "joinCode": "abc123" }
	 * // Represents the join code "abc123" for joining the organization
	 */
	@IsString()
	@IsNotEmpty()
	joinCode: string;
}

/**
 * OrgDto - Data Transfer Object for creating or updating an organization.
 *
 * This class defines the structure for creating or updating organization details.
 * It includes the title, description, and join code of the organization.
 */
export class OrgDto {
	/**
	 * The title of the organization.
	 *
	 * This field is required and represents the name of the organization.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "title": "Tech Group" }
	 * // Represents the organization titled "Tech Group"
	 */
	@IsString()
	@IsNotEmpty()
	title: string;

	/**
	 * A brief description of the organization.
	 *
	 * This field is optional and represents the description or mission statement of the organization.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "description": "A group of tech enthusiasts." }
	 * // Represents a brief description of the organization
	 */
	@IsString()
	@IsOptional()
	description: string;

	/**
	 * The join code for the organization.
	 *
	 * This field is required and represents the unique code needed to join the organization.
	 *
	 * @type {string}
	 * @required
	 *
	 * @example
	 * { "joinCode": "abc123" }
	 * // Represents the join code "abc123" for the organization
	 */
	@IsString()
	@IsNotEmpty()
	joinCode: string;
}
