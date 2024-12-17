// permission/permission.decorator.ts
import { JwtAuthGuard } from '@/api/auth/guards/jwt.guards'; // Importing JWT authentication guard
import { PermissionType } from '@/src/types/permissions.types'; // Importing the type for permissions
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'; // NestJS utilities for decorators
import { PermissionGuard } from '../guards/permission.guard'; // Importing the custom PermissionGuard

/**
 * Custom decorator that attaches required permissions to a route handler.
 * This decorator will also activate the necessary guards for authentication and permission checks.
 *
 * @param permissions A list of permissions that are required to access the route.
 * @returns A decorator function that sets metadata and applies guards.
 */
export const Permission = (...permissions: PermissionType[]) =>
	applyDecorators(
		// Set the metadata for the permissions required to access this route.
		SetMetadata('permissions', permissions),

		// Use both the JwtAuthGuard (for authentication) and PermissionGuard (for permission checks).
		UseGuards(JwtAuthGuard, PermissionGuard)
	);
