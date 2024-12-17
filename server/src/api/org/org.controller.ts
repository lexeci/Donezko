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
import { OrgDto } from './dto/org.dto';
import { OrgService } from './org.service';

@Controller('user/organizations')
export class OrgController {
	constructor(private readonly orgService: OrgService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.orgService.getAll(userId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: OrgDto, @CurrentUser('id') userId: string) {
		return this.orgService.create(dto, userId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Permission('updateOrganization')
	async update(
		@Body() dto: OrgDto,
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return this.orgService.update(dto, id, userId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('join')
	@Auth()
	async join(@Body() dto: OrgDto, @CurrentUser('id') userId: string) {
		return this.orgService.join(dto, userId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('/update-role/:id')
	@Permission('manageUsers')
	async updateRole(
		@Body() dto: OrgDto,
		@Param('id') orgId: string,
		@CurrentUser('id') currentUserId: string
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
		return this.orgService.updateRole(dto, orgId, currentUserId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('/update-status/:id')
	@Permission('manageUsers')
	async updateStatus(
		@Body() dto: OrgDto,
		@Param('id') orgId: string,
		@CurrentUser('id') currentUserId: string
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
		return this.orgService.updateStatus(dto, orgId, currentUserId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('/update-owner/:id')
	@Permission('transferOwnership')
	async updateOwner(
		@Body() dto: OrgDto,
		@CurrentUser('id') currentOwner: string,
		@Param('id') orgId: string
	) {
		return this.orgService.updateOwner(dto, currentOwner, orgId);
	}

	@HttpCode(200)
	@Delete('exit/:id')
	@Permission('viewResources')
	async exit(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.orgService.exit(id, userId);
	}

	@HttpCode(200)
	@Delete(':id')
	@Permission('deleteOrganization')
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.orgService.delete(id, userId);
	}
}
