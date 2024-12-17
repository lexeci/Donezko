import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

import type { TaskFormData, TaskResponse } from "@/types/task.types";

import { useDebouncedTaskHandler } from "@/hooks/tasks/useDebouncedTaskHandler";
import { useTaskRemoval } from "@/hooks/tasks/useTaskRemoval";
import { Task } from "@/src/components/ui";

interface KanbanTaskCardProps {
	item: TaskResponse;
	updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса для унікальності
}

export function KanbanTaskCard({ item, updateTasks }: KanbanTaskCardProps) {
	// Зміна назви компонента для унікальності
	const { register, control, watch } = useForm<TaskFormData>({
		defaultValues: {
			title: item.title,
			isCompleted: item.isCompleted,
			createdAt: item.createdAt,
			priority: item.priority,
		},
	});

	useDebouncedTaskHandler({ watch, taskId: item.id });

	const { removeTask, isRemovalPending } = useTaskRemoval();

	return (
		<Task
			removeTask={removeTask}
			updateTasks={updateTasks}
			control={control}
			register={register}
			watch={watch}
		/>
	);
}
