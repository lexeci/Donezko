import { additionalService } from "@/services/additional.service"; // Import the service handling API calls
import { WeatherResponse } from "@/types/additionalApi.types"; // Type for the weather response
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch weather data for a given city.
 *
 * @param city - The city name to fetch weather for.
 * @returns An object containing:
 *  - weather: The current weather data (or undefined if not loaded).
 *  - setWeather: Setter to manually update weather state if needed.
 *  - isLoading: Boolean flag indicating if the query is loading.
 *  - isError: Boolean flag indicating if the query has encountered an error.
 */
export function useFetchWeather(city: string) {
  // Local state to store fetched weather data
  const [weather, setWeather] = useState<WeatherResponse | undefined>(
    undefined
  );

  // React Query hook to fetch weather data
  const {
    data: weatherData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["weather", city], // Unique query key based on city
    queryFn: () => additionalService.getWeather(city), // API call to fetch weather
    enabled: !!city, // Only run query if city is provided
  });

  // Effect to update local state whenever new data arrives
  useEffect(() => {
    if (weatherData) {
      setWeather(weatherData);
    }
  }, [weatherData]);

  // Return current weather data and status flags
  return { weather, setWeather, isLoading, isError };
}
