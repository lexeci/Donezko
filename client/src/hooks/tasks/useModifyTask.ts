import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TaskFormData } from "@/types/task.types";

import { taskService } from "@/src/services/task.service";

export function useModifyTask() {
	// Зміна назви функції для унікальності
	const queryClient = useQueryClient();

	const { mutate: modifyTask } = useMutation({
		mutationKey: ["update task"], // Зміна назви ключа для унікальності
		mutationFn: (
			{ taskId, data }: { taskId: string; data: TaskFormData } // Зміна назви параметрів
		) => taskService.updateTask(taskId, data),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ["tasks"], // Зміна назви ключа для унікальності
			});
		},
	});

	return { modifyTask }; // Зміна назви функції, що повертається
}
