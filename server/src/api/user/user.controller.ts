import { Auth } from '@/api/auth/decorators/auth.decorator';
import { CurrentUser } from '@/api/auth/decorators/user.decorator';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

/**
 * UserController - A controller responsible for managing user profile-related operations.
 *
 * This controller provides endpoints to retrieve and update the profile of the authenticated user.
 * It relies on `UserService` for the underlying business logic and uses decorators like `Auth`
 * for authentication and `CurrentUser` to access user-specific data from the authentication context.
 *
 * @module UserController
 */
@Controller('user/profile')
export class UserController {
	/**
	 * Constructs a new instance of UserController.
	 *
	 * @param userService The service responsible for user-related business logic.
	 */
	constructor(private readonly userService: UserService) {}

	/**
	 * Retrieves the profile of the currently authenticated user.
	 *
	 * This endpoint is protected by the `Auth` decorator to ensure only authenticated users can access it.
	 * It retrieves the user's profile, including details such as total tasks and completed tasks, based
	 * on the user's ID from the authentication context.
	 *
	 * @param id The unique identifier of the authenticated user, retrieved via the `CurrentUser` decorator.
	 * @returns A promise resolving to the user's profile data.
	 *
	 * @example
	 * getProfile('userId');
	 * // Returns the profile data of the user with the specified ID.
	 */
	@Get()
	@Auth()
	async getProfile(@CurrentUser('id') id: string) {
		return this.userService.getProfile(id);
	}

	/**
	 * Updates the profile of the currently authenticated user.
	 *
	 * This endpoint is protected by the `Auth` decorator to ensure only authenticated users can update their profiles.
	 * It accepts a `UserDto` object containing the new profile data and uses `ValidationPipe` to validate the input.
	 *
	 * @param id The unique identifier of the authenticated user, retrieved via the `CurrentUser` decorator.
	 * @param dto The data transfer object containing the updated user data, including fields like name, email, and password.
	 * @returns A promise resolving to the updated user profile data after saving it in the database.
	 *
	 * @example
	 * updateProfile('userId', { name: 'Updated Name', email: 'newemail@example.com' });
	 * // Returns the updated profile of the user with the new data.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put()
	@Auth()
	async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
		return this.userService.update({id, dto});
	}
}
