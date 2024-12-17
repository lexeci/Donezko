import { PrismaService } from '@/src/prisma.service'; // Importing PrismaService to interact with the database
import { Module } from '@nestjs/common'; // Importing the Module decorator from NestJS
import { OrgController } from './org.controller'; // Importing the OrgController to handle HTTP requests
import { OrgService } from './org.service'; // Importing the OrgService to handle the business logic

/**
 * OrgModule - A module for managing organizational-related functionalities.
 *
 * This module includes:
 * - OrgController: A controller responsible for handling HTTP requests related to organizations.
 * - OrgService: A service that contains the business logic for managing organizations.
 * - PrismaService: A service for database interaction through Prisma ORM.
 *
 * The OrgModule encapsulates all the logic related to organizations and makes them available for
 * dependency injection in other modules.
 */
@Module({
	/**
	 * The controllers array defines the controllers that handle incoming HTTP requests in this module.
	 * In this case, OrgController handles requests related to organizations.
	 *
	 * @property {Array} controllers - List of controller classes for handling HTTP requests.
	 */
	controllers: [OrgController],

	/**
	 * The providers array defines the services that handle business logic for this module.
	 * OrgService handles organizational business logic, and PrismaService facilitates database interaction.
	 *
	 * @property {Array} providers - List of services used in this module.
	 */
	providers: [OrgService, PrismaService],

	/**
	 * The exports array specifies which services are available for use in other modules.
	 * In this case, OrgService is exported so it can be used in other modules.
	 *
	 * @property {Array} exports - List of services exported by this module.
	 */
	exports: [OrgService]
})
export class OrgModule {}
