import { AccessStatus, TeamRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class TeamDto {
	@IsString()
	@IsOptional()
	userId: string;

	@IsString()
	@IsOptional()
	teamId: string;

	@IsString()
	@IsOptional()
	title: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsString()
	@IsOptional()
	createdAt: string;

	@IsEnum(TeamRole)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	role: TeamRole;

	@IsEnum(AccessStatus)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toUpperCase())
	teamStatus: AccessStatus;
}
