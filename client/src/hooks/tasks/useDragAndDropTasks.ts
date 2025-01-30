import { DropResult } from "@hello-pangea/dnd";

import { DATE_FILTERS } from "@/constants/tasks.constants";

import { useOrganization } from "@/src/context/OrganizationContext";
import { useUpdateTask } from "./useUpdateTask";

export function useDragAndDropTasks(handleRefetch: () => void) {
	const { organizationId } = useOrganization();
	// Зміна назви хуку для унікальності
	const { modifyTask } = useUpdateTask(); // Зміна назви функції, що повертається

	const handleDragEnd = (result: DropResult) => {
		// Зміна назви функції для унікальності
		if (!result.destination) return;

		const targetColumnId = result.destination.droppableId; // Зміна назви змінної для унікальності

		if (targetColumnId === result.source.droppableId) return;

		if (targetColumnId === "completed") {
			organizationId &&
				modifyTask(
					{
						// Зміна назви функції
						taskId: result.draggableId, // Зміна назви параметра
						data: {
							organizationId,
							// Зміна назви параметра
							isCompleted: true,
						},
						organizationId,
					},
					{
						onSuccess: () => handleRefetch(),
					}
				);

			return;
		}

		const newCreatedAt = DATE_FILTERS[targetColumnId].format(); // Зміна назви змінної для унікальності

		if (organizationId) {
			modifyTask(
				{
					taskId: result.draggableId, // Зміна назви параметра
					data: {
						organizationId,
						createdAt: newCreatedAt as unknown as Date,
						isCompleted: false,
					},
					organizationId,
				},
				{
					onSuccess: () => handleRefetch(),
				}
			);
		}
	};

	return { handleDragEnd }; // Зміна назви функції, що повертається
}
