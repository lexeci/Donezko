import { AuthGuard } from '@nestjs/passport'; // Importing the AuthGuard from the passport module

/**
 * JwtAuthGuard is a custom guard that extends the AuthGuard provided by Passport.
 * It uses the 'jwt' strategy to handle authentication for JWT-based access control.
 *
 * This guard is used to protect routes that require JWT authentication, verifying the presence
 * of a valid token in the request headers.
 */
export class JwtAuthGuard extends AuthGuard('jwt') {}
