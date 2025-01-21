import { JwtAuthGuard } from '@/api/auth/guards/jwt.guards'; // Importing the JWT authentication guard.
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'; // NestJS utilities for creating custom decorators.
import { PermissionType } from '../permissions.types'; // Importing the type for permissions.
import { PermissionGuard } from '../guards/permission.guard'; // Importing the custom guard for permission checks.

/**
 * Permission - A custom decorator for attaching permissions to route handlers.
 *
 * This decorator is used to define the required permissions for accessing a route.
 * It automatically applies the necessary guards for authentication and permission validation:
 * - `JwtAuthGuard` ensures the user is authenticated.
 * - `PermissionGuard` checks whether the user has the specified permissions.
 *
 * @param {PermissionType[]} permissions - An array of permissions required to access the route.
 * @returns {Function} A decorator function that sets the permissions metadata and applies the guards.
 */
export const Permission = (...permissions: PermissionType[]) =>
	applyDecorators(
		// Attach the required permissions as metadata to the route.
		SetMetadata('permissions', permissions),

		// Apply guards for authentication and permission checks.
		UseGuards(JwtAuthGuard, PermissionGuard)
	);
