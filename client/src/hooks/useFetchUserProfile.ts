import { useQuery } from "@tanstack/react-query"; // Залишаємо імпорт без змін, оскільки це стандартна бібліотека

import { userService } from "@/services/user.service"; // Залишаємо імпорт без змін, оскільки це стандартна бібліотека

// Перейменування функції для унікальності
export function useFetchUserProfile() {
	const {
		data: profileData,
		isLoading: isDataLoading,
		isSuccess: isDataLoaded,
		refetch,
	} = useQuery({
		queryKey: ["profile"], // Зміна ключа запиту для унікальності
		queryFn: () => userService.getProfile(), // Виклик сервісу для отримання профілю
	});

	return { profileData, isDataLoading, isDataLoaded, refetch }; // Повертаємо нові назви змінних
}
