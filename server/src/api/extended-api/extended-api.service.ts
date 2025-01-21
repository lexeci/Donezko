import { HttpService } from '@nestjs/axios'; // Importing HttpService from NestJS to make HTTP requests
import { Injectable, UnauthorizedException } from '@nestjs/common'; // Importing decorators for injectable service and exceptions
import { ConfigService } from '@nestjs/config'; // Importing ConfigService to retrieve configuration values (like API keys)
import { AxiosError } from 'axios'; // Importing AxiosError type to handle Axios-specific errors
import { catchError, firstValueFrom } from 'rxjs'; // Importing RxJS operators for handling async calls and errors

/**
 * ExtendedApiService - Service for interacting with external APIs to get weather information, advice, and news.
 *
 * Provides methods to:
 * - Fetch current weather data based on the city.
 * - Retrieve random advice from an external advice API.
 * - Fetch random news related to Elon Musk from an external service.
 *
 * @module ExtendedApiService
 */
@Injectable()
export class ExtendedApiService {
	/**
	 * Constructs an instance of ExtendedApiService.
	 *
	 * @param {HttpService} httpService - The HttpService instance to perform HTTP requests.
	 * @param {ConfigService} configService - The ConfigService instance to access configuration settings.
	 */
	constructor(
		private httpService: HttpService,
		private configService: ConfigService
	) {}

	/**
	 * Fetches current weather information for a given city using an external weather API.
	 *
	 * The weather data is retrieved using the city name passed as a query parameter.
	 *
	 * @param {string} userCityAddress - The name of the city for which the weather data is requested.
	 * @returns {Promise<Object>} The weather data for the specified city.
	 *
	 * @throws {UnauthorizedException} If there is an error during the API request or invalid API key.
	 *
	 * @example
	 * getWeather('London'); // Returns weather data for London.
	 */
	async getWeather(userCityAddress: string) {
		// Retrieving the Weather API key from the environment variables or configuration
		const apiKey = this.configService.get('WEATHER_API_KEY');

		// Making the API request to get weather information
		const { data } = await firstValueFrom(
			this.httpService
				.get(
					`http://api.weatherapi.com/v1/current.json?q=${userCityAddress}&key=${apiKey}`
				) // API URL with query parameters
				.pipe(
					catchError((error: AxiosError) => {
						// Catching errors and throwing an UnauthorizedException with the error response data
						throw new UnauthorizedException(
							error.response?.data || 'Failed to fetch weather data'
						);
					})
				)
		);

		// Returning the data from the weather API
		return data;
	}

	/**
	 * Fetches a random piece of advice from an external advice API.
	 *
	 * @returns {Promise<Object>} The advice data retrieved from the external advice service.
	 *
	 * @throws {UnauthorizedException} If there is an error during the API request.
	 *
	 * @example
	 * getAdvice(); // Returns a random piece of advice.
	 */
	async getAdvice() {
		// Making the API request to get advice from the advice service
		const { data } = await firstValueFrom(
			this.httpService.get('https://api.adviceslip.com/advice').pipe(
				catchError((error: AxiosError) => {
					// Catching errors and throwing an UnauthorizedException with the error response data
					throw new UnauthorizedException(
						error.response?.data || 'Failed to fetch advice'
					);
				})
			)
		);

		// Returning the advice data
		return data;
	}

	/**
	 * Fetches a random Elon news from an external elonmu.sh API.
	 *
	 * @returns {Promise<Object>} The Elon news data retrieved from the external service.
	 *
	 * @throws {UnauthorizedException} If there is an error during the API request.
	 *
	 * @example
	 * getElonNews(); // Returns a random Elon news.
	 */
	async getElonNews() {
		// Making the API request to get Elon news from the elonmu.sh service
		const { data } = await firstValueFrom(
			this.httpService.get('https://elonmu.sh/api').pipe(
				catchError((error: AxiosError) => {
					// Catching errors and throwing an UnauthorizedException with the error response data
					throw new UnauthorizedException(
						error.response?.data || 'Failed to fetch Elon news'
					);
				})
			)
		);

		// Returning the elonmu.sh data
		return data;
	}
}
