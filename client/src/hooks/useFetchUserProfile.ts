import { userService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useCookieMonitor } from "./useCookieMonitor";

export function useFetchUserProfile() {
	const [cookiesExist, setCookiesExist] = useState(false);

	// Колбек, коли кука з'являється
	const handleCookieChange = () => {
		setCookiesExist(true);
	};

	// Колбек, коли кука зникає
	const handleCookieRemove = () => {
		setCookiesExist(false);
	};

	// Викликаємо useCookieMonitor з двома колбеками
	useCookieMonitor("accessToken", handleCookieChange, handleCookieRemove);

	// Завжди викликаємо useQuery, але включаємо/виключаємо запит залежно від cookiesExist
	const {
		data: profileData,
		isLoading: isDataLoading,
		isSuccess: isDataLoaded,
		refetch, // Отримуємо метод refetch
	} = useQuery({
		queryKey: ["profile"],
		queryFn: () => userService.getProfile(),
		enabled: cookiesExist, // Запит виконується лише, якщо кука існує
		retry: false, // Не намагаємося повторювати запит, якщо кука відсутня
	});

	return { profileData, isDataLoading, isDataLoaded, refetch };
}
