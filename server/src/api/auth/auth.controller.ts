import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'; // Importing necessary decorators and classes from NestJS
import { Request, Response } from 'express'; // Importing Request and Response from Express
import { AuthService } from './auth.service'; // Importing the AuthService to handle authentication logic
import { AuthDto } from './dto/auth.dto'; // Importing the DTO for authentication data transfer objects

/**
 * AuthController handles the routes related to user authentication such as login, registration, token refresh, and logout.
 * It integrates with AuthService to handle authentication-related business logic.
 */
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * Refresh the access token using the refresh token sent in the cookies.
	 * This endpoint requires the refresh token to be passed in the request cookies.
	 *
	 * @param req - The request object which contains the refresh token in cookies.
	 * @param res - The response object which will have a new refresh token set in cookies.
	 * @returns The new access token and user details.
	 * @throws UnauthorizedException if the refresh token is not provided.
	 */
	@HttpCode(200)
	@Post('login/access-token')
	async refreshTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		// Extract the refresh token from the cookies
		const refreshTokensFromCookies =
			req.cookies[this.authService.REFRESH_TOKEN_NAME];

		// If no refresh token is found, remove any existing refresh token from the response and throw an exception
		if (!refreshTokensFromCookies) {
			this.authService.removeRefreshTokenToResponse(res);
			throw new UnauthorizedException('Refresh token not passed');
		}

		// Validate the refresh token and issue new tokens
		const { refreshToken, ...response } = await this.authService.refreshTokens(
			refreshTokensFromCookies
		);

		// Add the new refresh token to the response cookies
		this.authService.addRefreshTokenToResponse(res, refreshToken);

		// Return the new access token and user data
		return response;
	}

	/**
	 * Login the user by validating the credentials and returning tokens.
	 * This endpoint expects an email and password in the request body.
	 *
	 * @param dto - Data transfer object (DTO) containing email and password.
	 * @param res - The response object which will have the refresh token set in cookies.
	 * @returns The access token and user details.
	 */
	@UsePipes(new ValidationPipe()) // Use validation pipe to validate the incoming data.
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		// Call the AuthService to handle login logic
		const { refreshToken, ...response } = await this.authService.login(dto);

		// Set the refresh token in the response cookies
		this.authService.addRefreshTokenToResponse(res, refreshToken);

		// Return the access token and user details
		return response;
	}

	/**
	 * Register a new user by validating the registration data and creating a new user.
	 * This endpoint expects user data (email and password) in the request body.
	 *
	 * @param dto - Data transfer object (DTO) containing registration data (email, password).
	 * @param res - The response object which will have the refresh token set in cookies.
	 * @returns The access token and user details.
	 */
	@UsePipes(new ValidationPipe()) // Use validation pipe to validate the incoming data.
	@HttpCode(200)
	@Post('register')
	async register(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		// Call the AuthService to handle registration logic
		const { refreshToken, ...response } = await this.authService.register(dto);

		// Set the refresh token in the response cookies
		this.authService.addRefreshTokenToResponse(res, refreshToken);

		// Return the access token and user details
		return response;
	}

	/**
	 * Logout the user by removing the refresh token from cookies.
	 * This endpoint does not require any data in the request body.
	 *
	 * @param res - The response object which will have the refresh token removed from cookies.
	 * @returns A success status (`true`).
	 */
	@HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		// Remove the refresh token from cookies
		this.authService.removeRefreshTokenToResponse(res);

		// Return a success response indicating the user has logged out
		return true;
	}
}
