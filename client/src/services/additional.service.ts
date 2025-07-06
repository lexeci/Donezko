import { axiosClassic } from "@/api/interceptors";
import {
  AdviceResponse,
  ElonNewsResponse,
  WeatherResponse,
} from "@/types/additionalApi.types";
import { toast } from "sonner";

/**
 * @class AdditionalService
 *
 * Service class for interacting with extended APIs like weather, advice, and Elon Musk news.
 * This class provides methods to fetch weather information, advice quotes, and Elon Musk news.
 * Each method makes a GET request to the respective endpoint and returns the response data.
 *
 * Methods:
 * - `getWeather`: Fetches the weather information for a specified city.
 * - `getAdvice`: Fetches a random advice quote.
 * - `getElonNews`: Fetches the latest news related to Elon Musk.
 *
 * Error handling is implemented to log and throw errors in case of failed API requests.
 * The errors are caught in a `try...catch` block to ensure proper failure handling and recovery.
 *
 * Example usage:
 * @example
 * const weatherData = await additionalService.getWeather("London");
 * const advice = await additionalService.getAdvice();
 * const elonNews = await additionalService.getElonNews();
 */
class AdditionalService {
  private BASE_URL = "/extended-api"; // Base URL for the extended API

  /**
   * Fetches weather information for a given city.
   * Sends a GET request to the `/weather` endpoint with the city as a query parameter.
   * @param city - The name of the city to fetch the weather for
   * @returns {Promise<WeatherResponse>} - The weather data for the specified city
   * @throws {Error} - Throws an error if the weather fetch fails
   * @example
   * const weatherData = await additionalService.getWeather("London");
   */
  async getWeather(city: string): Promise<WeatherResponse> {
    try {
      const response = await axiosClassic.get<WeatherResponse>(
        `${this.BASE_URL}/weather?city=${city}`
      );
      return response.data;
    } catch (error: any) {
      error && toast.error("Couldn't catch any weather information");
      console.error(`Fetching weather error:`, error);
      throw new Error(`Fetching weather failed`);
    }
  }

  /**
   * Fetches an advice quote.
   * Sends a GET request to the `/advice` endpoint to retrieve advice.
   * @returns {Promise<AdviceResponse>} - The advice response data
   * @throws {Error} - Throws an error if the advice fetch fails
   * @example
   * const advice = await additionalService.getAdvice();
   */
  async getAdvice(): Promise<AdviceResponse> {
    try {
      const response = await axiosClassic.get<AdviceResponse>(
        `${this.BASE_URL}/advice`
      );
      return response.data;
    } catch (error) {
      console.error(`Fetching advice error:`, error);
      throw new Error(`Fetching advice failed`);
    }
  }

  /**
   * Fetches news related to Elon Musk.
   * Sends a GET request to the `/elonnews` endpoint to retrieve the news.
   * @returns {Promise<ElonNewsResponse>} - The Elon Musk news data
   * @throws {Error} - Throws an error if the Elon Musk news fetch fails
   * @example
   * const elonNews = await additionalService.getElonNews();
   */
  async getElonNews(): Promise<ElonNewsResponse> {
    try {
      const response = await axiosClassic.get<ElonNewsResponse>(
        `${this.BASE_URL}/elonnews`
      );
      return response.data;
    } catch (error) {
      console.error(`Fetching Elon Musk News error:`, error);
      throw new Error(`Fetching Elon Musk News failed`);
    }
  }
}

// Create an instance of the AdditionalService class
export const additionalService = new AdditionalService();
