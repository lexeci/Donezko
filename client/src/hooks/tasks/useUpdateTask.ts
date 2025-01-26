import { useMutation } from "@tanstack/react-query";

import { TaskFormData, TaskResponse } from "@/types/task.types";

import { taskService } from "@/src/services/task.service";
import { useState } from "react";
import { toast } from "sonner";

export function useUpdateTask() {
	// Зміна назви функції для унікальності
	const [updatedTask, setUpdatedTask] = useState<TaskResponse | undefined>(
		undefined
	);

	const { mutate: modifyTask, isPending } = useMutation({
		mutationKey: ["update task"], // Зміна назви ключа для унікальності
		mutationFn: (
			{
				taskId,
				organizationId,
				data,
			}: { taskId: string; data: TaskFormData; organizationId: string } // Зміна назви параметрів
		) => taskService.updateTask({ id: taskId, data, organizationId }),
		onSuccess(data) {
			toast.success("Successfully updated task!");
			setUpdatedTask(data);
		},
	});

	return { modifyTask, updatedTask, isPending }; // Зміна назви функції, що повертається
}
