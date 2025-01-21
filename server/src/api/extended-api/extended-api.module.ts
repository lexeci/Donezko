import { HttpModule } from '@nestjs/axios'; // Importing HttpModule to make HTTP requests
import { Module } from '@nestjs/common'; // Importing the Module decorator from NestJS
import { ConfigModule } from '@nestjs/config'; // Importing ConfigModule to manage environment configurations
import { ExtendedApiController } from './extended-api.controller'; // Importing the extendedApiController to handle HTTP requests
import { ExtendedApiService } from './extended-api.service'; // Importing the extendedApiService to handle business logic

/**
 * ExtendedApiModule - A module for interacting with external APIs (weather and advice services).
 *
 * This module includes:
 * - ExtendedApiController: A controller responsible for handling HTTP requests related to external APIs.
 * - ExtendedApiService: A service that contains the business logic for interacting with external APIs such as weather and advice.
 * - HttpModule: A NestJS module for making HTTP requests.
 * - ConfigModule: A NestJS module for accessing configuration values like API keys.
 *
 * The extendedApiModule encapsulates all the logic related to fetching weather and advice from external services
 * and makes them available for dependency injection in other modules.
 */
@Module({
	/**
	 * The controllers array defines the controllers that handle incoming HTTP requests for this module.
	 * In this case, the extendedApiController handles requests related to the external APIs.
	 *
	 * @property {Array} controllers - List of controller classes that handle HTTP requests.
	 */
	controllers: [ExtendedApiController],

	/**
	 * The providers array defines the services that handle business logic within this module.
	 * In this case, the extendedApiService contains the logic for interacting with external APIs (weather and advice).
	 *
	 * @property {Array} providers - List of services used in this module.
	 */
	providers: [ExtendedApiService],

	/**
	 * The exports array specifies which services should be made available for use in other modules.
	 * In this case, extendedApiService is exported so that other modules can use it.
	 *
	 * @property {Array} exports - List of services that are made available to other modules.
	 */
	exports: [ExtendedApiService],

	/**
	 * The imports array defines which external modules are required by this module.
	 * HttpModule is used for making HTTP requests, and ConfigModule is used to access environment variables.
	 *
	 * @property {Array} imports - List of external modules that this module depends on.
	 */
	imports: [HttpModule, ConfigModule]
})
export class ExtendedApiModule {}
