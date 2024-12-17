import { additionalService } from "@/services/additional.service"; // Шлях до вашого сервісу
import { WeatherResponse } from "@/src/types/additionalApi.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchWeather(city: string) {
	const {
		data: weatherData,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["weather", city],
		queryFn: () => additionalService.getWeather(city),
		enabled: !!city, // Виконуємо запит лише якщо є значення міста
	});

	const [weather, setWeather] = useState<WeatherResponse | null>(
		weatherData || null
	);

	useEffect(() => {
		setWeather(weatherData || null);
	}, [weatherData]);

	return { weather, setWeather, isLoading, isError };
}
