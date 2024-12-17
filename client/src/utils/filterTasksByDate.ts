import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import { DATE_FILTERS } from "@/src/constants/tasks.constants";
import type { TaskResponse } from "@/types/task.types";

// Розширення dayjs плагінами
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Функція для фільтрації задач
export const filterTasksByDate = (
	tasks: TaskResponse[] | undefined,
	filterValue: string
) => {
	if (!tasks) return [];

	const isTaskIncomplete = (item: TaskResponse) => !item.isCompleted;

	const filterStrategies: Record<string, () => TaskResponse[]> = {
		today: () =>
			tasks.filter(
				item =>
					item.createdAt && // Ensure createdAt is defined
					dayjs(item.createdAt).isSame(dayjs(), "day") &&
					isTaskIncomplete(item)
			),

		tomorrow: () =>
			tasks.filter(
				item =>
					dayjs(item.createdAt).isSame(DATE_FILTERS.tomorrow, "day") &&
					isTaskIncomplete(item)
			),

		thisWeek: () =>
			tasks.filter(
				item =>
					item.createdAt && // Ensure createdAt is defined
					!dayjs(item.createdAt).isSame(dayjs(), "day") &&
					!dayjs(item.createdAt).isSame(DATE_FILTERS.tomorrow) &&
					dayjs(item.createdAt).isSameOrBefore(DATE_FILTERS.thisWeek) &&
					isTaskIncomplete(item)
			),

		nextWeek: () =>
			tasks.filter(
				item =>
					dayjs(item.createdAt).isAfter(DATE_FILTERS.thisWeek) &&
					dayjs(item.createdAt).isSameOrBefore(DATE_FILTERS.nextWeek) &&
					isTaskIncomplete(item)
			),

		later: () =>
			tasks.filter(
				item =>
					(dayjs(item.createdAt).isAfter(DATE_FILTERS.nextWeek) ||
						!item.createdAt) &&
					isTaskIncomplete(item)
			),

		completed: () => tasks.filter(item => item.isCompleted),
	};

	return filterStrategies[filterValue]?.() || [];
};
