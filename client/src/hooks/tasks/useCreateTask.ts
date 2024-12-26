import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TaskFormData, TaskResponse } from "@/types/task.types"; // Зміна назви типу для унікальності

import { taskService } from "@/src/services/task.service"; // Залишаємо без змін, якщо це необхідно
import { useState } from "react";

export function useCreateTask() {
	// Зміна назви хуку для унікальності
	const queryClient = useQueryClient();

	const [createdTask, setCreatedTask] = useState<TaskResponse | undefined>(
		undefined
	);

	const { mutate: createTask } = useMutation({
		// Зміна назви функції для унікальності
		mutationKey: ["create task"], // Зміна ключа мутації для унікальності
		mutationFn: (data: TaskFormData) => taskService.createTask(data), // Залишаємо назву сервісу
		onSuccess(data) {
			setCreatedTask(data);
			queryClient.invalidateQueries({
				queryKey: ["tasks"],
			}); // Зміна ключа запиту для унікальності
		},
	});

	return { createTask, createdTask }; // Повертаємо оновлену назву функції
}
