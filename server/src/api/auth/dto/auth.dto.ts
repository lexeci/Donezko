import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength
} from 'class-validator';

export class AuthDto {
	@IsNotEmpty({ message: 'Email must not be empty' })
	@IsEmail()
	email: string;

	@IsNotEmpty({ message: 'Name must not be empty' })
	@MinLength(4, {
		message: 'Name should be longer than 4 characters'
	})
	@Matches(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ\s]+$/, {
		message: 'Name can contain only litters and spaces'
	})
	@IsString()
	name: string;

	@IsNotEmpty({ message: 'Password must not be empty' })
	@MinLength(6, {
		message: 'Password must have more than 6 characters'
	})
	@IsString()
	password: string;
}
