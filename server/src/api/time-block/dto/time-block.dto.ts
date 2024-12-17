import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TimeBlockDto {
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	color?: string;

	@IsNumber()
	duration: number;

	@IsNumber()
	@IsOptional()
	order: number;
}
