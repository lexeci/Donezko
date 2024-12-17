import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	MinLength
} from 'class-validator';

/**
 * TimerSettingsDto - Data Transfer Object for timer settings.
 *
 * This class defines the structure for setting and managing intervals related to a timer system.
 * It is used for validating and transferring timer-related data such as work intervals, break intervals,
 * and the number of intervals in a session.
 */
export class TimerSettingsDto {
	/**
	 * The interval (in minutes) for the work phase.
	 *
	 * This is an optional property that defines the duration of a work interval. It must be a number and
	 * cannot be less than 1 minute.
	 *
	 * @type {number}
	 * @optional
	 * @min 1
	 */
	@IsOptional()
	@IsNumber()
	@Min(1)
	workInterval?: number;

	/**
	 * The interval (in minutes) for the break phase.
	 *
	 * This is an optional property that defines the duration of a break interval. It must be a number and
	 * cannot be less than 1 minute.
	 *
	 * @type {number}
	 * @optional
	 * @min 1
	 */
	@IsOptional()
	@IsNumber()
	@Min(1)
	breakInterval?: number;

	/**
	 * The number of work and break intervals in a session.
	 *
	 * This optional property defines how many work-break cycles there should be in a session. It must be
	 * a number between 1 and 10.
	 *
	 * @type {number}
	 * @optional
	 * @min 1
	 * @max 10
	 */
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(10)
	intervalsCount?: number;
}

/**
 * UserDto - Data Transfer Object for user data, extending TimerSettingsDto.
 *
 * This class defines the structure for user-related data. It includes email, password, and optional
 * timer settings such as work intervals and break intervals.
 * The `UserDto` extends `TimerSettingsDto`, meaning it inherits timer settings properties.
 */
export class UserDto extends TimerSettingsDto {
	/**
	 * The user's email address.
	 *
	 * This is an optional property that must be a valid email address if provided.
	 *
	 * @type {string}
	 * @optional
	 * @isEmail
	 */
	@IsEmail()
	@IsOptional()
	email: string;

	/**
	 * The user's password.
	 *
	 * This is an optional property that must be a string and at least 6 characters long. If provided,
	 * the password must meet the minimum length requirement.
	 *
	 * @type {string}
	 * @optional
	 * @minLength 6
	 */
	@IsOptional()
	@MinLength(6, {
		message: 'Password must have more than 6 characters'
	})
	@IsString()
	@IsOptional()
	password: string;
}
