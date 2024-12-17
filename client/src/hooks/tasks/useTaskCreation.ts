import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TaskFormData } from "@/types/task.types"; // Зміна назви типу для унікальності

import { taskService } from "@/src/services/task.service"; // Залишаємо без змін, якщо це необхідно

export function useTaskCreation() {
	// Зміна назви хуку для унікальності
	const queryClient = useQueryClient();

	const { mutate: addNewTask } = useMutation({
		// Зміна назви функції для унікальності
		mutationKey: ["create task"], // Зміна ключа мутації для унікальності
		mutationFn: (taskData: TaskFormData) => taskService.createTask(taskData), // Залишаємо назву сервісу
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ["tasks"],
			}); // Зміна ключа запиту для унікальності
		},
	});

	return { addNewTask }; // Повертаємо оновлену назву функції
}
