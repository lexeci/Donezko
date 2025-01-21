import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { TaskResponse } from "@/types/task.types";

import { taskService } from "@/src/services/task.service";

export function useFetchTasks({
	organizationId,
	projectId,
	teamId,
	available = false,
}: {
	organizationId?: string | null;
	projectId?: string | null;
	teamId?: string | null;
	available?: boolean;
}) {
	const [taskList, setTaskList] = useState<TaskResponse[] | undefined>(
		undefined
	);

	const {
		data: tasksData,
		refetch,
		isFetching,
		isFetched,
	} = useQuery({
		queryKey: ["tasks", projectId, teamId, available],
		queryFn: () => {
			// Перевірка параметрів перед виконанням функції
			return taskService.getTasks({
				organizationId,
				projectId: projectId,
				teamId: teamId,
				available: available,
			});
		},
		enabled: !!organizationId && !!projectId, // Запит виконується лише якщо projectId визначений
	});

	useEffect(() => {
		setTaskList(tasksData); // Оновлюємо стан, коли tasksData змінюється
	}, [tasksData]);

	const handleRefetch = () => {
		refetch(); // Виклик повторного запиту
	};

	return { taskList, setTaskList, handleRefetch, isFetching, isFetched };
}
