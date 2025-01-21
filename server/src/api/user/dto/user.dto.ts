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
 * This class defines the structure for managing and transferring timer-related data.
 * It includes work interval, break interval, and the total number of intervals in a session.
 * These properties are used to configure a timer system.
 */
export class TimerSettingsDto {
	/**
	 * The interval for the work phase, specified in minutes.
	 *
	 * This property is optional and represents the duration of a single work interval.
	 * It must be a number greater than or equal to 1.
	 *
	 * @type {number}
	 * @optional
	 *
	 * @example
	 * { "workInterval": 25 }
	 * // Represents a work interval of 25 minutes
	 */
	@IsOptional()
	@IsNumber()
	@Min(1)
	workInterval?: number;

	/**
	 * The interval for the break phase, specified in minutes.
	 *
	 * This property is optional and represents the duration of a single break interval.
	 * It must be a number greater than or equal to 1.
	 *
	 * @type {number}
	 * @optional
	 *
	 * @example
	 * { "breakInterval": 5 }
	 * // Represents a break interval of 5 minutes
	 */
	@IsOptional()
	@IsNumber()
	@Min(1)
	breakInterval?: number;

	/**
	 * The total number of work and break intervals in a session.
	 *
	 * This property is optional and defines the number of cycles for work and break intervals.
	 * It must be a number between 1 and 10.
	 *
	 * @type {number}
	 * @optional
	 *
	 * @example
	 * { "intervalsCount": 4 }
	 * // Represents a session with 4 work and break intervals
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
 * This class defines the structure for user-related data. It includes email, password, and name,
 * as well as optional timer settings such as work intervals and break intervals.
 * The UserDto extends TimerSettingsDto, meaning it inherits timer settings properties.
 */
export class UserDto extends TimerSettingsDto {
	/**
	 * The user's email address.
	 *
	 * This property is optional and must be a valid email address if provided.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "email": "user@example.com" }
	 * // Represents a valid email address for the user
	 */
	@IsEmail()
	@IsOptional()
	email: string;

	/**
	 * The user's password.
	 *
	 * This property is optional and represents the user's password. If provided, it must be at least
	 * 6 characters long. The password is required for authentication purposes.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "password": "securePassword123" }
	 * // Represents the user's password
	 */
	@IsOptional()
	@MinLength(6, {
		message: 'Password must have more than 6 characters'
	})
	@IsString()
	password: string;

	/**
	 * The user's name.
	 *
	 * This property is optional and represents the name of the user. If provided, it must be at least
	 * 3 characters long. It is used for display purposes.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "name": "John Doe" }
	 * // Represents the user's full name
	 */
	@IsString()
	@IsOptional()
	@MinLength(3, {
		message: 'Name must have more than 3 characters'
	})
	name: string;

	/**
	 * The user's city.
	 *
	 * This property is optional and represents the city of the user. If provided, it must be at least
	 * 3 characters long. It is used for display purposes.
	 *
	 * @type {string}
	 * @optional
	 *
	 * @example
	 * { "city": "New York" }
	 * // Represents the user's city
	 */
	@IsString()
	@IsOptional()
	@MinLength(3, {
		message: 'City must have more than 3 characters'
	})
	city: string;
}
