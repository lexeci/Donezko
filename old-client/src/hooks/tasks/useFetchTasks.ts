import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { TaskResponse } from "@/types/task.types";

import { taskService } from "@/services/task.service";

export function useFetchTasks() { // Зміна назви хуку для унікальності
	const { data: tasksData } = useQuery({ // Зміна назви змінної для унікальності
		queryKey: ["tasks"],
		queryFn: () => taskService.getTasks(),
	});

	const [taskList, setTaskList] = useState<TaskResponse[] | undefined>(tasksData); // Зміна назви змінної

	useEffect(() => {
		setTaskList(tasksData); // Зміна назви змінної для унікальності
	}, [tasksData]); // Зміна назви змінної для унікальності

	return { taskList, setTaskList }; // Зміна назви змінної для унікальності
}
