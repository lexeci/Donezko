import {
	IsOptional,
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength
} from 'class-validator'; // Importing decorators from class-validator for input validation

/**
 * AuthDto - Data Transfer Object (DTO) used to validate the input data
 * during authentication operations such as login and registration.
 * It contains the user's email, name, and password, and applies various validation rules.
 *
 * @module AuthDto
 */
export class AuthDto {
	/**
	 * The user's email address.
	 *
	 * Validation rules:
	 * - Must not be empty.
	 * - Must be a valid email address format.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "email": "user@example.com" }
	 * // Represents a valid email address for the user
	 */
	@IsNotEmpty({ message: 'Email must not be empty' })
	@IsEmail()
	email: string;

	/**
	 * The user's name.
	 *
	 * Validation rules:
	 * - Must not be empty.
	 * - Must be at least 4 characters long.
	 * - Must match a regular expression that allows only letters (both English and Cyrillic) and spaces.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "name": "John Doe" }
	 * // Represents a valid name with letters and spaces
	 */
	@IsNotEmpty({ message: 'Name must not be empty' })
	@MinLength(4, {
		message: 'Name should be longer than 4 characters'
	})
	@Matches(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ\s]+$/, {
		message: 'Name can contain only letters and spaces'
	})
	@IsString()
	name: string;

	/**
	 * The user's city.
	 *
	 * Validation rules:
	 * - Must not be empty.
	 * - Must be at least 3 characters long.
	 * - Must match a regular expression that allows only letters (both English and Cyrillic) and spaces.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "name": "Lviv" }
	 * // Represents a valid name with letters and spaces
	 */
	@IsOptional()
	@MinLength(3, {
		message: 'City should be longer than 3 characters'
	})
	@Matches(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ\s]+$/, {
		message: 'City can contain only letters and spaces'
	})
	@IsString()
	city: string;

	/**
	 * The user's password.
	 *
	 * Validation rules:
	 * - Must not be empty.
	 * - Must be at least 6 characters long.
	 * - Must be a string value.
	 *
	 * @type {string}
	 *
	 * @example
	 * { "password": "securePassword123" }
	 * // Represents a valid password that is at least 6 characters long
	 */
	@IsNotEmpty({ message: 'Password must not be empty' })
	@MinLength(6, {
		message: 'Password must have more than 6 characters'
	})
	@IsString()
	password: string;
}
