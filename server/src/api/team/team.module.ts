import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

/**
 * TeamModule - Module for managing teams within an organization and project.
 *
 * This module encapsulates the logic and routes related to teams. Teams represent groups of users that collaborate
 * on specific projects and tasks. The module includes the following components:
 * - **TeamController**: Handles incoming HTTP requests related to teams. It exposes API endpoints for creating, updating,
 *   deleting, and managing teams.
 * - **TeamService**: Contains the business logic for interacting with teams, including CRUD operations, role management,
 *   and access control.
 * - **PrismaService**: Provides access to the database for storing and querying team-related data.
 *
 * @module TeamModule
 */
@Module({
	/**
	 * The controllers that handle incoming HTTP requests.
	 * - `TeamController`: The controller responsible for exposing API endpoints related to teams, such as fetching team details,
	 *   creating teams, and updating team information.
	 */
	controllers: [TeamController],

	/**
	 * The services that provide business logic.
	 * - `TeamService`: The service responsible for handling CRUD operations related to teams, user roles, and access control.
	 * - `PrismaService`: The service used to interact with the database (via Prisma ORM) for team data management.
	 */
	providers: [TeamService, PrismaService],

	/**
	 * The services that are exported from this module for use in other modules.
	 * - `TeamService`: This service is exported so that other modules can interact with team data, such as managing users in teams
	 *   or performing team-related operations.
	 */
	exports: [TeamService]
})
export class TeamModule {}
