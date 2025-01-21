import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { PermissionGuard } from './guards/permission.guard';

/**
 * PermissionModule - Module responsible for handling permission-related logic in the application.
 *
 * This module provides the `PermissionGuard` for securing routes based on user permissions.
 * It also provides the `PrismaService` for interacting with the database to fetch and manage permissions.
 */
@Module({
	/**
	 * The providers array includes services and guards that provide functionality to the module.
	 * In this case, it contains:
	 * - `PermissionGuard`, which is responsible for handling permission checks for routes.
	 * - `PrismaService`, which is used for database interaction related to permissions.
	 *
	 * @property {Array} providers - List of services and guards to be provided within this module.
	 */
	providers: [PermissionGuard, PrismaService],

	/**
	 * The exports array specifies which services or guards are available to be imported and used by other modules.
	 * In this case, the `PermissionGuard` is exported so it can be used in other modules for permission-based route guarding.
	 *
	 * @property {Array} exports - List of services or guards to be made available for use by other modules.
	 */
	exports: [PermissionGuard] // Exporting the PermissionGuard for use in other modules
})
export class PermissionModule {}
