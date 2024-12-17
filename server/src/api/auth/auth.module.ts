import { getJwtConfig } from '@/api/config/jwt.config'; // Function to retrieve JWT configuration
import { UserModule } from '@/api/user/user.module'; // User module for managing user-related logic
import { Module } from '@nestjs/common'; // NestJS module decorator
import { ConfigModule, ConfigService } from '@nestjs/config'; // For environment variable management
import { JwtModule } from '@nestjs/jwt'; // For JWT handling in NestJS
import { AuthController } from './auth.controller'; // AuthController to handle authentication routes
import { AuthService } from './auth.service'; // AuthService for authentication logic
import { JwtStrategy } from './jwt.strategy'; // JWT strategy for passport authentication

/**
 * AuthModule handles the authentication logic in the application.
 * It integrates user authentication, JWT-based authorization, and cookie management for secure user sessions.
 */
@Module({
	imports: [
		// Importing UserModule to interact with user-related operations such as creating and retrieving users
		UserModule,

		// ConfigModule to load environment variables or configurations
		ConfigModule,

		// Configuring the JwtModule asynchronously using a factory function to retrieve JWT configuration from environment variables
		JwtModule.registerAsync({
			imports: [ConfigModule], // Ensures the ConfigModule is available for dependency injection
			inject: [ConfigService], // Injecting ConfigService to fetch config values
			useFactory: getJwtConfig // Using the factory function to get the JWT configuration
		})
	],
	controllers: [AuthController], // Registers the AuthController for handling routes related to authentication
	providers: [
		AuthService, // AuthService is responsible for handling user login, registration, and JWT token issuance
		JwtStrategy // JwtStrategy is used to validate JWT tokens and manage authentication flow
	]
})
export class AuthModule {}
