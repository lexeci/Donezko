import { useQuery } from "@tanstack/react-query"; // Залишаємо імпорт без змін, оскільки це стандартна бібліотека

import { adviceService } from "@/services/advice.service"; // Залишаємо імпорт без змін, оскільки це стандартна бібліотека

// Перейменування функції для унікальності
export function useFetchAdvice() {
	const { data: adviceData, isLoading: isDataLoading, isSuccess: isDataLoaded } = useQuery({
		queryKey: ["advice"], // Зміна ключа запиту для унікальності
		queryFn: () => adviceService.getAdvice(), // Виклик сервісу для отримання профілю
	});

	return { adviceData, isDataLoading, isDataLoaded }; // Повертаємо нові назви змінних
}
