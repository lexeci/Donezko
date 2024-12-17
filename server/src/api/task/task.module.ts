import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

/**
 * TaskModule - A module for managing user tasks.
 * This module provides functionalities for creating, updating, deleting tasks, and adding comments to them.
 *
 * The module includes:
 * - TaskController: A controller for handling HTTP requests related to tasks.
 * - TaskService: A service for executing business logic related to tasks.
 * - PrismaService: A service for interacting with the database via Prisma ORM.
 *
 * @module TaskModule
 */
@Module({
	/**
	 * Controllers: An array of controllers that handle incoming HTTP requests.
	 * In this case, the module has one controller - TaskController.
	 *
	 * @property {Array} controllers - An array of controller classes for handling HTTP requests.
	 */
	controllers: [TaskController],

	/**
	 * Providers: An array of services that will be available for dependency injection in this module.
	 * - TaskService: A service for handling task-related business logic.
	 * - PrismaService: A service for database interaction via Prisma ORM.
	 *
	 * @property {Array} providers - An array of services used by this module.
	 */
	providers: [TaskService, PrismaService],

	/**
	 * Exports: Exports the TaskService to allow other modules to use it if needed.
	 *
	 * @property {Array} exports - An array of services to export from this module.
	 */
	exports: [TaskService]
})
export class TaskModule {}
