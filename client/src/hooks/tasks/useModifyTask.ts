import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TaskFormData } from "@/types/task.types";

import { taskService } from "@/src/services/task.service";

export function useModifyTask(taskKey?: string) {
	// Зміна назви функції для унікальності
	const queryClient = useQueryClient();

	const { mutate: modifyTask } = useMutation({
		mutationKey: ["update task", taskKey], // Зміна назви ключа для унікальності
		mutationFn: (
			{ taskId, taskData }: { taskId: string; taskData: TaskFormData } // Зміна назви параметрів
		) => taskService.updateTask(taskId, taskData),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ["tasks"], // Зміна назви ключа для унікальності
			});
		},
	});

	return { modifyTask }; // Зміна назви функції, що повертається
}
