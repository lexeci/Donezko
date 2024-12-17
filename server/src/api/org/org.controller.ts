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
 */
@Controller('user/organizations')
export class OrgController {
	constructor(private readonly orgService: OrgService) {}

	/**
	 * Get all organizations the current user is part of.
	 * @param userId The ID of the current user.
	 * @returns List of organizations.
	 */
	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.orgService.getAll(userId);
	}

	/**
	 * Create a new organization.
	 * @param dto The details of the organization to be created.
	 * @param userId The ID of the current user who is creating the organization.
	 * @returns Created organization details.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: OrgDto, @CurrentUser('id') userId: string) {
		return this.orgService.create({ dto, userId });
	}

	/**
	 * Update an existing organization.
	 * @param id The ID of the organization to be updated.
	 * @param dto The updated details of the organization.
	 * @param userId The ID of the current user who is making the update.
	 * @returns Updated organization details.
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
	 * Join an organization using a join code.
	 * @param dto Contains the title and join code of the organization to join.
	 * @param userId The ID of the current user.
	 * @returns Success message or the joined organization details.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('join')
	@Auth()
	async join(@Body() dto: JoinOrgDto, @CurrentUser('id') userId: string) {
		return this.orgService.join({ dto, userId });
	}

	/**
	 * Update the role of a user in the organization.
	 * @param id The ID of the organization.
	 * @param dto Contains the user ID and the new role to assign.
	 * @param userId The ID of the current user making the role change.
	 * @throws ForbiddenException if the role is not allowed.
	 * @returns Updated role details.
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
		// Allowed roles for the organization
		const allowedRoles: OrgRole[] = [
			OrgRole.ADMIN,
			OrgRole.VIEWER,
			OrgRole.MEMBER
		];

		// If the requested role is not allowed, throw an exception
		if (!allowedRoles.includes(dto.role)) {
			throw new ForbiddenException(
				`Role ${dto.role} is not allowed to be assigned.`
			);
		}

		return this.orgService.updateRole({ id, dto, userId });
	}

	/**
	 * Update the status of a user within the organization.
	 * @param id The ID of the organization.
	 * @param dto Contains the user ID and the new status to assign.
	 * @param userId The ID of the current user making the status change.
	 * @throws ForbiddenException if the status is not allowed.
	 * @returns Updated status details.
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
		// Allowed statuses for the organization
		const allowedStatus: AccessStatus[] = [
			AccessStatus.ACTIVE,
			AccessStatus.BANNED
		];

		// If the requested status is not allowed, throw an exception
		if (!allowedStatus.includes(dto.organizationStatus)) {
			throw new ForbiddenException(
				`Status ${dto.organizationStatus} is not allowed to be assigned.`
			);
		}

		return this.orgService.updateStatus({ id, dto, userId });
	}

	/**
	 * Transfer the ownership of the organization to another user.
	 * @param id The ID of the organization.
	 * @param dto Contains the user ID of the new owner.
	 * @param userId The ID of the current user transferring ownership.
	 * @returns Updated organization owner details.
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
	 * Exit an organization.
	 * @param id The ID of the organization the user is exiting.
	 * @param userId The ID of the current user exiting the organization.
	 * @returns Success message or the updated organization details.
	 */
	@HttpCode(200)
	@Delete('exit/:id')
	@Permission('viewResources')
	async exit(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.orgService.exit({ id, userId });
	}

	/**
	 * Delete an organization.
	 * @param id The ID of the organization to be deleted.
	 * @param userId The ID of the current user deleting the organization.
	 * @returns Success message or the deleted organization details.
	 */
	@HttpCode(200)
	@Delete(':id')
	@Permission('deleteOrganization')
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.orgService.delete({ id, userId });
	}
}
