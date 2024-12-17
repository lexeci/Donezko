import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	MinLength
} from 'class-validator';

export class TimerSettingsDto {
	@IsOptional()
	@IsNumber()
	@Min(1)
	workInterval?: number;

	@IsOptional()
	@IsNumber()
	@Min(1)
	breakInterval?: number;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(10)
	intervalsCount?: number;
}

export class UserDto extends TimerSettingsDto {
	@IsEmail()
	@IsOptional()
	email: string;

	@IsOptional()
	@MinLength(6, {
		message: 'Password must have more than 6 characters'
	})
	@IsString()
	@IsOptional()
	password: string;
}
