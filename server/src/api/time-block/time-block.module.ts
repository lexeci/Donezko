import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { TimeBlockController } from './time-block.controller';
import { TimeBlockService } from './time-block.service';

/**
 * TimeBlockModule - Module for managing time blocks.
 *
 * This module encapsulates the logic and routes related to time blocks. A time block is a segment of time within
 * a user's schedule that can be managed and reordered.
 * It includes the following components:
 * - **TimeBlockController**: Handles incoming HTTP requests related to time blocks.
 * - **TimeBlockService**: Contains the business logic for interacting with the time blocks (CRUD operations).
 * - **PrismaService**: Provides access to the database for storing and querying time block data.
 *
 * @module TimeBlockModule
 */
@Module({
	/**
	 * The controllers that handle incoming HTTP requests.
	 * - `TimeBlockController`: The controller responsible for exposing API endpoints related to time blocks.
	 */
	controllers: [TimeBlockController],

	/**
	 * The services that provide business logic.
	 * - `TimeBlockService`: The service responsible for CRUD operations related to time blocks and their order.
	 * - `PrismaService`: The service used to interact with the database (via Prisma ORM) for time block data.
	 */
	providers: [TimeBlockService, PrismaService],

	/**
	 * The services that are exported from this module for use in other modules.
	 * - `TimeBlockService`: This service is exported so it can be used by other modules that need to interact with time blocks.
	 */
	exports: [TimeBlockService]
})
export class TimeBlockModule {}
