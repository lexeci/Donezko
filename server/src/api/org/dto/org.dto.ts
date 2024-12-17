import { AccessStatus, OrgRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class OrgDto {
	@IsString()
	@IsOptional()
	userId: string;

	@IsString()
	@IsOptional()
	title: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsString()
	@IsOptional()
	joinCode: string;

	@IsString()
	@IsOptional()
	createdAt: string;

	@IsEnum(OrgRole)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	role: OrgRole;

	@IsEnum(AccessStatus)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	organizationStatus: AccessStatus;
}
