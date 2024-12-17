import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

/**
 * The JwtStrategy class defines the strategy for handling JWT-based authentication.
 * It extends the PassportStrategy to integrate JWT authentication in the NestJS framework.
 * The strategy is used to extract and validate JWT tokens for API requests.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  /**
   * The constructor initializes the JWT strategy configuration.
   * 
   * @param configService - A service to retrieve configuration values, such as JWT_SECRET.
   * @param userService - A service that interacts with the user repository to fetch user data.
   */
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
    // Configure Passport JWT strategy with required settings
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract the JWT from the Authorization header
      ignoreExpiration: true, // Whether to ignore the expiration date of the JWT (recommended to be false in production)
      secretOrKey: configService.get('JWT_SECRET') // Secret key used to validate the JWT
    });
  }

  /**
   * The validate method is called after the JWT token is successfully verified.
   * It retrieves the user associated with the provided user ID from the decoded JWT token.
   *
   * @param payload - The decoded JWT payload, which includes the user's ID.
   * @returns The user object if the user is found, or throws an exception if not.
   *
   * @throws {UnauthorizedException} If the user with the given ID cannot be found.
   */
  async validate({ id }: { id: string }) {
    // Call the UserService to get the user by the ID provided in the JWT
    return this.userService.getById(id); 
  }
}
