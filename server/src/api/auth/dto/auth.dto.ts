import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength
} from 'class-validator'; // Importing decorators from class-validator for input validation

/**
 * AuthDto is a Data Transfer Object (DTO) used to validate the input data
 * during authentication operations such as login and registration.
 * It contains the user's email, name, and password, and applies various validation rules.
 */
export class AuthDto {
	/**
	 * The user's email address.
	 *
	 * Validation rules:
	 * - Must not be empty.
	 * - Must be a valid email address format.
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
	 * The user's password.
	 *
	 * Validation rules:
	 * - Must not be empty.
	 * - Must be at least 6 characters long.
	 * - Must be a string value.
	 */
	@IsNotEmpty({ message: 'Password must not be empty' })
	@MinLength(6, {
		message: 'Password must have more than 6 characters'
	})
	@IsString()
	password: string;
}
