import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { PermissionGuard } from './guards/permission.guard';

/**
 * The PermissionModule handles the logic related to permissions in the application.
 * It provides the PermissionGuard for guarding routes based on user permissions.
 * It also provides the PrismaService for interacting with the database.
 */
@Module({
	/**
	 * The providers array includes the services or guards that provide functionality for this module.
	 * In this case, it contains the PermissionGuard, which is responsible for handling permission checks,
	 * and the PrismaService, which interacts with the database.
	 *
	 * @property {Array} providers - Array of services and guards to be used in this module.
	 */
	providers: [PermissionGuard, PrismaService],

	/**
	 * The exports array specifies which services or guards are available to be imported and used by other modules.
	 * In this case, the PermissionGuard is exported so that other modules can use it for permission-based route guarding.
	 *
	 * @property {Array} exports - Array of services or guards to be made available for other modules.
	 */
	exports: [PermissionGuard] // Exporting PermissionGuard so it can be used by other modules
})
export class PermissionModule {}
