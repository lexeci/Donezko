import debounce from "lodash.debounce";
import { useCallback, useEffect } from "react";
import { UseFormWatch } from "react-hook-form";

import { TaskFormData } from "@/types/task.types";

import { useModifyTask } from "./useModifyTask"; // Зміна назви хуку
import { useTaskCreation } from "./useTaskCreation"; // Зміна назви хуку

interface DebouncedTaskHandlerProps {
	watch: UseFormWatch<TaskFormData>;
	taskId: string; // Зміна назви параметра для унікальності
}

export function useDebouncedTaskHandler({
	watch,
	taskId,
}: DebouncedTaskHandlerProps) {
	const { addNewTask: createTask } = useTaskCreation();
	const { modifyTask: updateTask } = useModifyTask();

	const debouncedTaskCreation = useCallback(
		debounce((formData: TaskFormData) => {
			createTask(formData);
		}, 444),
		[]
	);

	const debouncedTaskUpdate = useCallback(
		debounce((formData: TaskFormData) => {
			updateTask({ taskId, taskData: formData });
		}, 444),
		[]
	);

	useEffect(() => {
		const { unsubscribe } = watch(formData => {
			if (taskId) {
				debouncedTaskUpdate({
					...formData,
					priority: formData.priority || undefined,
				});
			} else {
				debouncedTaskCreation(formData);
			}
		});

		return () => {
			unsubscribe();
		};
	}, [watch, debouncedTaskUpdate, debouncedTaskCreation]); // Виправлення залежностей
}
