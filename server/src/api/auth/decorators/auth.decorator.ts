import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guards';

/**
 * Custom decorator to use the JwtAuthGuard on a route handler.
 * This decorator is used to automatically apply authentication guard (JWT) to any controller method.
 *
 * @returns - Applies the JwtAuthGuard to the route handler method where the decorator is used.
 */
export const Auth = () => UseGuards(JwtAuthGuard);
