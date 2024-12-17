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
 * This controller exposes endpoints for getting and updating the user's profile.
 * It uses the `UserService` to handle the business logic related to the user's profile.
 * The `Auth` decorator ensures that the user is authenticated, while the `CurrentUser` decorator
 * is used to access the current user's ID from the authentication context.
 *
 * @module UserController
 */
@Controller('user/profile')
export class UserController {
	/**
	 * Creates an instance of UserController.
	 *
	 * @param userService The service that handles the user-related operations.
	 */
	constructor(private readonly userService: UserService) {}

	/**
	 * Endpoint to get the profile of the currently authenticated user.
	 *
	 * This route is protected by the `Auth` decorator to ensure the user is authenticated. It retrieves
	 * the profile of the user based on the user's ID from the authentication context.
	 *
	 * @param id The ID of the currently authenticated user, retrieved using the `CurrentUser` decorator.
	 * @returns The profile of the user, including statistics like total tasks and completed tasks.
	 */
	@Get()
	@Auth()
	async profile(@CurrentUser('id') id: string) {
		return this.userService.getProfile(id);
	}

	/**
	 * Endpoint to update the profile of the currently authenticated user.
	 *
	 * This route is protected by the `Auth` decorator to ensure the user is authenticated. The user can
	 * update their profile using the provided `UserDto`, which contains the new user data.
	 * The `ValidationPipe` ensures that the input data is valid according to the rules defined in the DTO.
	 *
	 * @param id The ID of the currently authenticated user, retrieved using the `CurrentUser` decorator.
	 * @param dto The updated user data, including fields like name, email, and password.
	 * @returns The updated user data after it has been saved to the database.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put()
	@Auth()
	async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
		return this.userService.update(id, dto);
	}
}
