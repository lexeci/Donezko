import { ConfigService } from '@nestjs/config'; // Importing ConfigService to retrieve configuration values
import { JwtModuleOptions } from '@nestjs/jwt'; // Importing JwtModuleOptions type for JWT configuration

/**
 * Asynchronously retrieves the JWT configuration.
 * This function fetches the JWT secret from the configuration service
 * and returns it in a format compatible with JwtModuleOptions.
 *
 * @param confirmService - An instance of ConfigService used to fetch configuration values
 * @returns A promise that resolves to the JWT configuration options.
 *
 * @example
 * const jwtConfig = await getJwtConfig(configService);
 * // jwtConfig will contain the 'secret' key for signing JWT tokens
 */
export const getJwtConfig = async (
	confirmService: ConfigService // ConfigService is injected here to fetch the JWT_SECRET
): Promise<JwtModuleOptions> => ({
	secret: confirmService.get('JWT_SECRET') // Retrieves the 'JWT_SECRET' from the environment/config
});
