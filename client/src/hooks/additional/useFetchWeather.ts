import {additionalService} from "@/services/additional.service"; // Шлях до вашого сервісу
import {WeatherResponse} from "@/types/additionalApi.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchWeather(city: string) {
    const [weather, setWeather] = useState<WeatherResponse | undefined>(
        undefined
    );

    const {
        data: weatherData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["weather", city],
        queryFn: () => additionalService.getWeather(city),
        enabled: !!city, // Виконуємо запит лише якщо є значення міста
    });

    useEffect(() => {
        if (weatherData) {
            setWeather(weatherData);
        }
    }, [weatherData]);

    return {weather, setWeather, isLoading, isError};
}
