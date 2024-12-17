import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { TaskResponse } from "@/types/task.types";

import { taskService } from "@/services/task.service";

export function useTasks() {
	const { data } = useQuery({
		queryKey: ["tasks"],
		queryFn: () => taskService.getTasks(),
	});

	const [items, setItems] = useState<TaskResponse[] | undefined>(data?.data);

	useEffect(() => {
		setItems(data?.data);
	}, [data?.data]);

	return { items, setItems };
}
