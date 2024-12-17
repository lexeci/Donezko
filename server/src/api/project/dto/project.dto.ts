import { AccessStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ProjectDto {
	@IsString()
	@IsOptional()
	organizationId: string;

	@IsString()
	@IsOptional()
	projectId: string;

	@IsString()
	@IsOptional()
	userId: string;

	@IsString()
	@IsOptional()
	title: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsEnum(AccessStatus)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	projectStatus: AccessStatus;
}
