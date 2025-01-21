import { Auth } from '@/api/auth/decorators/auth.decorator';
import { CurrentUser } from '@/api/auth/decorators/user.decorator';
import { Permission } from '@/api/permission/decorators/permission.decorator';
import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AccessStatus, OrgRole } from '@prisma/client';
import {
	JoinOrgDto,
	ManageOrgUserDto,
	OrgDto,
	TransferOrgOwnerDto
} from './dto/org.dto';
import { OrgService } from './org.service';

/**
 * Controller for managing organizations and user roles within organizations.
 * This controller handles the creation, updating, deletion, and management of organizations and their users.
 */
@Controller('user/organizations')
export class OrgController {
	constructor(private readonly orgService: OrgService) {}

	/**
	 * Retrieves all organizations the current user is part of.
	 * @param userId The ID of the current user.
	 * @param organizationId The ID of the specific organization to be displayed.
	 * @returns List of organizations the user belongs to or the specified organization.
	 * @example
	 * // Example of retrieving all organizations
	 * const organizations = await orgController.getAll({ userId: 'user123' });
	 *
	 * // Example of retrieving a specific organization by ID
	 * const organization = await orgController.getAll({ organizationId: 'org123', userId: 'user123' });
	 */
	@Get()
	@Auth()
	async getAll(
		@Query('organizationId') organizationId: string,
		@CurrentUser('id') userId: string
	) {
		return organizationId
			? this.orgService.getById({ id: organizationId, userId })
			: this.orgService.getAll(userId);
	}

	/**
	 * Retrieves users from a specific organization.
	 * @param id The ID of the organization to fetch users from.
	 * @param userId The ID of the current user making the request.
	 * @param projectId The project ID to filter users already involved in the project.
	 * @param hideProject Flag to exclude users already part of the project.
	 * @param teamId The team ID to filter users involved in a specific team.
	 * @param hideTeam Flag to exclude users already part of the team.
	 * @returns List of users in the organization, filtered by the provided parameters.
	 * @example
	 * // Example of retrieving users from an organization
	 * const users = await orgController.getUsers({ id: 'org123', userId: 'user123' });
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get(':id/users')
	@Permission('manageUsers')
	async getUsers(
		@Param('id') id: string,
		@CurrentUser('id') userId: string,
		@Query('projectId') projectId: string,
		@Query('hideProject') hideProject: boolean,
		@Query('teamId') teamId: string,
		@Query('hideTeam') hideTeam: boolean
	) {
		return this.orgService.getUsers({
			id,
			userId,
			projectId,
			hideProject,
			teamId,
			hideTeam
		});
	}

	/**
	 * Retrieves the role of the current user within a specific organization.
	 * @param id The ID of the organization.
	 * @param userId The ID of the current user.
	 * @returns The role of the current user within the specified organization.
	 * @example
	 * // Example of retrieving the user's role in an organization
	 * const role = await orgController.getOrganizationRole({ id: 'org123', userId: 'user123' });
	 */
	@Get(':id/role')
	@Auth()
	async getOrganizationRole(
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return this.orgService.getOrganizationRole({
			id,
			userId
		});
	}

	/**
	 * Creates a new organization.
	 * @param dto Contains the details required to create the organization.
	 * @param userId The ID of the current user creating the organization.
	 * @returns The created organization's details.
	 * @example
	 * // Example of creating a new organization
	 * const newOrganization = await orgController.create({ dto: { name: 'New Organization' }, userId: 'user123' });
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: OrgDto, @CurrentUser('id') userId: string) {
		return this.orgService.create({ dto, userId });
	}

	/**
	 * Updates an existing organization.
	 * @param id The ID of the organization to be updated.
	 * @param dto Contains the updated details of the organization.
	 * @param userId The ID of the current user making the update.
	 * @returns The updated organization's details.
	 * @example
	 * // Example of updating an existing organization
	 * const updatedOrganization = await orgController.update({ id: 'org123', dto: { name: 'Updated Organization' }, userId: 'user123' });
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Permission('updateOrganization')
	async update(
		@Param('id') id: string,
		@Body() dto: OrgDto,
		@CurrentUser('id') userId: string
	) {
		return this.orgService.update({ id, dto, userId });
	}

	/**
	 * Allows a user to join an organization using a join code.
	 * @param dto Contains the title and join code of the organization.
	 * @param userId The ID of the current user.
	 * @returns A success message or the joined organization details.
	 * @example
	 * // Example of joining an organization
	 * const joinedOrganization = await orgController.join({ dto: { joinCode: 'ABC123' }, userId: 'user123' });
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('join')
	@Auth()
	async join(@Body() dto: JoinOrgDto, @CurrentUser('id') userId: string) {
		return this.orgService.join({ dto, userId });
	}

	/**
	 * Updates the role of a user within the organization.
	 * @param id The ID of the organization.
	 * @param dto Contains the user ID and the new role to assign.
	 * @param userId The ID of the current user making the role change.
	 * @throws ForbiddenException If the role is not allowed to be assigned.
	 * @returns The updated role details.
	 * @example
	 * // Example of updating a user's role
	 * const updatedRole = await orgController.updateRole({ id: 'org123', dto: { userId: 'user456', role: 'ADMIN' }, userId: 'user123' });
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id/update-role/')
	@Permission('manageUsers')
	async updateRole(
		@Param('id') id: string,
		@Body() dto: ManageOrgUserDto,
		@CurrentUser('id') userId: string
	) {
		const allowedRoles: OrgRole[] = [
			OrgRole.ADMIN,
			OrgRole.VIEWER,
			OrgRole.MEMBER
		];

		if (!allowedRoles.includes(dto.role)) {
			throw new ForbiddenException(
				`Role ${dto.role} is not allowed to be assigned.`
			);
		}

		return this.orgService.updateRole({ id, dto, userId });
	}

	/**
	 * Updates the status of a user within the organization.
	 * @param id The ID of the organization.
	 * @param dto Contains the user ID and the new status to assign.
	 * @param userId The ID of the current user making the status change.
	 * @throws ForbiddenException If the status is not allowed to be assigned.
	 * @returns The updated status details.
	 * @example
	 * // Example of updating a user's status
	 * const updatedStatus = await orgController.updateStatus({ id: 'org123', dto: { userId: 'user456', organizationStatus: 'ACTIVE' }, userId: 'user123' });
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id/update-status/')
	@Permission('manageUsers')
	async updateStatus(
		@Param('id') id: string,
		@Body() dto: ManageOrgUserDto,
		@CurrentUser('id') userId: string
	) {
		const allowedStatus: AccessStatus[] = [
			AccessStatus.ACTIVE,
			AccessStatus.BANNED
		];

		if (!allowedStatus.includes(dto.organizationStatus)) {
			throw new ForbiddenException(
				`Status ${dto.organizationStatus} is not allowed to be assigned.`
			);
		}

		return this.orgService.updateStatus({ id, dto, userId });
	}

	/**
	 * Transfers the ownership of the organization to another user.
	 * @param id The ID of the organization.
	 * @param dto Contains the user ID of the new owner.
	 * @param userId The ID of the current user transferring ownership.
	 * @returns The updated organization owner details.
	 * @example
	 * // Example of transferring ownership
	 * const updatedOwner = await orgController.updateOwner({ id: 'org123', dto: { userId: 'user789' }, userId: 'user123' });
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id/update-owner/')
	@Permission('transferOwnership')
	async updateOwner(
		@Param('id') id: string,
		@Body() dto: TransferOrgOwnerDto,
		@CurrentUser('id') userId: string
	) {
		return this.orgService.updateOwner({ id, dto, userId });
	}

	/**
	 * Allows a user to exit an organization.
	 * @param id The ID of the organization the user is exiting.
	 * @param userId The ID of the current user exiting the organization.
	 * @returns A success message or the updated organization details.
	 * @example
	 * // Example of exiting an organization
	 * const result = await orgController.exit({ id: 'org123', userId: 'user123' });
	 */
	@HttpCode(200)
	@Delete(':id/exit')
	@Permission('viewResources')
	async exit(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.orgService.exit({ id, userId });
	}

	/**
	 * Deletes an organization.
	 * @param id The ID of the organization to be deleted.
	 * @param userId The ID of the current user deleting the organization.
	 * @returns A success message or the deleted organization details.
	 * @example
	 * // Example of deleting an organization
	 * const result = await orgController.delete({ id: 'org123', userId: 'user123' });
	 */
	@HttpCode(200)
	@Delete(':id')
	@Permission('deleteOrganization')
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.orgService.delete({ id, userId });
	}
}
