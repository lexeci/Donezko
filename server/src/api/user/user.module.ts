import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

/**
 * UserModule - A module responsible for handling user-related operations.
 *
 * This module includes the user controller and the user service, and is responsible
 * for managing user-related requests such as creating, updating, and retrieving user data.
 *
 * It also includes the PrismaService for interacting with the database to perform
 * CRUD operations on the user entity.
 *
 * @module UserModule
 */
@Module({
	/**
	 * The controllers that handle user-related HTTP requests.
	 *
	 * The `UserController` manages incoming requests related to user data.
	 * It includes endpoints for retrieving, creating, and updating users.
	 */
	controllers: [UserController],

	/**
	 * The providers that are injected into the module.
	 *
	 * The `UserService` handles the business logic of interacting with the user entity,
	 * while `PrismaService` provides the database connection and ORM functionality
	 * for performing CRUD operations on the user model.
	 */
	providers: [UserService, PrismaService],

	/**
	 * The services that should be exported from this module for use in other modules.
	 *
	 * The `UserService` is exported so it can be used by other modules that require
	 * user-related functionality.
	 */
	exports: [UserService]
})
export class UserModule {}
