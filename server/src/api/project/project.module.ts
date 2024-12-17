import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

/**
 * The ProjectModule encapsulates the logic related to managing projects within an organization.
 * It includes the ProjectController to handle HTTP requests, the ProjectService for business logic,
 * and the PrismaService to interact with the database.
 */
@Module({
	/**
	 * The controllers array defines the controller(s) responsible for handling incoming HTTP requests.
	 * In this case, it includes the ProjectController which manages all project-related HTTP endpoints.
	 *
	 * @property {Array} controllers - Array of controllers handling HTTP requests.
	 */
	controllers: [ProjectController],

	/**
	 * The providers array includes services that are responsible for the core business logic of the application.
	 * The PrismaService is used for interacting with the database, while the ProjectService contains
	 * the logic for creating, updating, and deleting projects.
	 *
	 * @property {Array} providers - Array of services used by this module.
	 */
	providers: [ProjectService, PrismaService],

	/**
	 * The exports array specifies which services should be made available for other modules to import and use.
	 * In this case, it exports the ProjectService so that it can be used in other modules if necessary.
	 *
	 * @property {Array} exports - Array of services to be exported for use in other modules.
	 */
	exports: [ProjectService]
})
export class ProjectModule {}
