import { UserService } from '@/api/user/user.service';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { CookieOptions, Response } from 'express';
import { AuthDto } from './dto/auth.dto';

/**
 * AuthService handles user authentication and authorization logic.
 * This service is responsible for logging in, registering users,
 * generating access and refresh tokens, and managing cookies for
 * authentication purposes.
 */
@Injectable()
export class AuthService {
	// Token expiration time constants
	EXPIRE_DAY_REFRESH_TOKEN = 1; // Expiration time for refresh token in days
	REFRESH_TOKEN_NAME = 'refreshToken'; // Name of the refresh token cookie

	constructor(
		private jwt: JwtService, // JWT service for generating and verifying tokens
		private userService: UserService, // User service for interacting with user data
		private configService: ConfigService // Config service for retrieving configuration values
	) {}

	/**
	 * Issues access and refresh tokens for a given user ID.
	 *
	 * @param userId - The ID of the user for whom tokens are being issued.
	 * @returns An object containing the access token and refresh token.
	 */
	private issueTokens(userId: string) {
		const data = { id: userId };

		// Generate the access token (valid for 1 hour)
		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		});

		// Generate the refresh token (valid for 7 days)
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		});

		return { accessToken, refreshToken };
	}

	/**
	 * Validates the user credentials during login or registration.
	 * Checks if the user exists and if the provided password matches.
	 *
	 * @param dto - The authentication data transfer object containing email and password.
	 * @returns The user object if validation is successful.
	 * @throws NotFoundException if the user does not exist.
	 * @throws UnauthorizedException if the password is incorrect.
	 */
	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email);

		if (!user) throw new NotFoundException('User not found');

		const isValid = await verify(user.password, dto.password);

		if (!isValid) throw new UnauthorizedException('Invalid password');

		return user;
	}

	/**
	 * Configures the cookie options for setting the refresh token in the response.
	 *
	 * @param expires - The expiration date of the cookie.
	 * @returns The cookie options used to set the refresh token in the response.
	 */
	private getCookieResponseValue(expires: Date) {
		return {
			httpOnly: true, // The cookie cannot be accessed via JavaScript
			domain: this.configService.get('LOCAL_DOMAIN'), // The domain of the cookie
			expires, // Set the expiration date of the cookie
			secure: true, // The cookie is only sent over HTTPS
			sameSite: 'none' // Allow cross-site requests
		} as CookieOptions;
	}

	/**
	 * Logs in a user by validating their credentials and issuing tokens.
	 *
	 * @param dto - The authentication data transfer object containing user credentials.
	 * @returns An object containing the user and their generated tokens (accessToken, refreshToken).
	 */
	async login(dto: AuthDto) {
		// Validate the user's credentials
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto);
		const tokens = this.issueTokens(user.id);

		return {
			user,
			...tokens
		};
	}

	/**
	 * Registers a new user by checking if the user already exists,
	 * creating the user, and issuing tokens.
	 *
	 * @param dto - The data transfer object containing user registration information.
	 * @returns An object containing the newly created user and their generated tokens (accessToken, refreshToken).
	 * @throws BadRequestException if a user with the same email already exists.
	 */
	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email);

		if (oldUser) throw new BadRequestException('User already exists');

		// Create the user in the database and issue tokens
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto);
		const tokens = this.issueTokens(user.id);

		return {
			user,
			...tokens
		};
	}

	/**
	 * Adds the refresh token to the response as a cookie.
	 *
	 * @param res - The HTTP response object to send the cookie in.
	 * @param refreshToken - The refresh token to be stored in the cookie.
	 */
	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

		res.cookie(
			this.REFRESH_TOKEN_NAME,
			refreshToken,
			this.getCookieResponseValue(expiresIn)
		);
	}

	/**
	 * Removes the refresh token from the response by setting its value to an empty string.
	 * This is typically done during logout.
	 *
	 * @param res - The HTTP response object to remove the cookie from.
	 */
	removeRefreshTokenToResponse(res: Response) {
		res.cookie(
			this.REFRESH_TOKEN_NAME,
			'',
			this.getCookieResponseValue(new Date(0)) // Expiring the cookie
		);
	}

	/**
	 * Refreshes the access and refresh tokens using the provided refresh token.
	 *
	 * @param refreshToken - The refresh token used to generate new access and refresh tokens.
	 * @returns An object containing the user and their newly generated tokens (accessToken, refreshToken).
	 * @throws UnauthorizedException if the refresh token is invalid.
	 */
	async refreshTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken);

		if (!result) throw new UnauthorizedException('Invalid refresh token');

		// Retrieve the user associated with the refresh token
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.getById(result.id);

		// Issue new tokens
		const tokens = this.issueTokens(user.id);

		return {
			user,
			...tokens
		};
	}
}
