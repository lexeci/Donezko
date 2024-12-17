import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';

/**
 * TimerModule - A module responsible for managing timer sessions and rounds for users.
 *
 * This module encapsulates the functionality of creating, updating, and deleting timer sessions and rounds. It includes
 * the `TimerService` to handle the core business logic and the `TimerController` to expose API endpoints. The `PrismaService`
 * is used for interacting with the database to persist the data.
 *
 * @module TimerModule
 */
@Module({
	/**
	 * The controllers that handle incoming requests.
	 * - `TimerController`: The controller responsible for exposing timer-related API endpoints.
	 */
	controllers: [TimerController],

	/**
	 * The services that provide the business logic.
	 * - `TimerService`: The service that contains the logic for creating and managing timer sessions and rounds.
	 * - `PrismaService`: Service for interacting with the Prisma ORM and performing database operations.
	 */
	providers: [TimerService, PrismaService],

	/**
	 * The services that are exported from this module for use in other modules.
	 * - `TimerService`: This service is exported so it can be used in other parts of the application.
	 */
	exports: [TimerService]
})
export class TimerModule {}
