import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '@prisma/client';

/**
 * Custom decorator to extract the current authenticated user from the request.
 * This decorator is used to access the authenticated user's data in controllers.
 *
 * @param data (optional) - A specific field of the user object to retrieve.
 * If not provided, the entire user object will be returned.
 * @param ctx - The execution context provided by NestJS.
 *
 * @returns - The requested user data or the entire user object if no field is specified.
 */
export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		// Retrieve the request object from the execution context
		const request = ctx.switchToHttp().getRequest();

		// Get the user object attached to the request (typically by JwtStrategy or AuthGuard)
		const user = request.user;

		// If the 'data' argument is provided, return only the specific field of the user, otherwise return the entire user object
		return data ? user[data] : user;
	}
);
