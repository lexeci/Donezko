import { Controller, Get, HttpCode, Query } from '@nestjs/common'; // Importing necessary decorators and classes from NestJS
import { ExtendedApiService } from './extended-api.service'; // Importing the service for the extended API functionality

/**
 * The controller for handling requests related to extended API operations.
 * This controller defines endpoints for fetching weather information and advice.
 */
@Controller('extended-api')
export class ExtendedApiController {
	// Injecting the extendedApiService into the controller to handle business logic
	constructor(private readonly extendedApiService: ExtendedApiService) {}

	/**
	 * Endpoint to get weather information based on the user's city.
	 * This handler uses a query parameter 'city' to fetch weather data.
	 *
	 * @param userCityAddress - The name of the city provided as a query parameter
	 * @returns The weather data for the provided city
	 *
	 * @example
	 * GET /extended-api/weather?city=London
	 * // Returns weather data for the city of London
	 */
	@HttpCode(200) // Setting HTTP status code to 200 for successful responses
	@Get('weather') // HTTP GET request for the 'weather' route
	async weather(@Query('city') userCityAddress: string) {
		// Calling the service method to get weather data by the provided city
		return await this.extendedApiService.getWeather(userCityAddress);
	}

	/**
	 * Endpoint to fetch advice from the external advice service.
	 * This endpoint doesn't require any query parameters and simply fetches advice.
	 *
	 * @returns The fetched advice
	 *
	 * @example
	 * GET /extended-api/advice
	 * // Returns a piece of advice from the advice service
	 */
	@HttpCode(200) // Setting HTTP status code to 200 for successful responses
	@Get('advice') // HTTP GET request for the 'advice' route
	async advice() {
		// Calling the service method to get advice
		return await this.extendedApiService.getAdvice();
	}

	/**
	 * Endpoint to fetch advice from the external Elon Musk news service.
	 * This endpoint doesn't require any query parameters and simply fetches news.
	 * Returns random news about Elon Musk from the elonmu.sh service
	 *
	 * @returns The fetched Elon Musk news.
	 *
	 * @example
	 * GET /extended-api/elonnews
	 * // Returns random news about Elon Musk from the elonmu.sh service
	 */
	@HttpCode(200) // Setting HTTP status code to 200 for successful responses
	@Get('elonnews') // HTTP GET request for the 'elonnews' route
	async elonNews() {
		// Calling the service method to get news
		return await this.extendedApiService.getElonNews();
	}
}
