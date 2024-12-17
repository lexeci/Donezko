import { DropResult } from "@hello-pangea/dnd";

import { DATE_FILTERS } from "@/app/workspace/tasks/columns.data";

import { useModifyTask } from "./useModifyTask";

export function useDragAndDropTasks() {
	// Зміна назви хуку для унікальності
	const { modifyTask } = useModifyTask(); // Зміна назви функції, що повертається

	const handleDragEnd = (result: DropResult) => {
		// Зміна назви функції для унікальності
		if (!result.destination) return;

		const targetColumnId = result.destination.droppableId; // Зміна назви змінної для унікальності

		if (targetColumnId === result.source.droppableId) return;

		if (targetColumnId === "completed") {
			modifyTask({
				// Зміна назви функції
				taskId: result.draggableId, // Зміна назви параметра
				taskData: {
					// Зміна назви параметра
					isCompleted: true,
				},
			});

			return;
		}

		const newCreatedAt = DATE_FILTERS[targetColumnId].format(); // Зміна назви змінної для унікальності

		modifyTask({
			taskId: result.draggableId, // Зміна назви параметра
			taskData: {
				createdAt: newCreatedAt,
				isCompleted: false,
			},
		});
	};

	return { handleDragEnd }; // Зміна назви функції, що повертається
}
