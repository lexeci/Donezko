import {DropResult} from "@hello-pangea/dnd";

import {DATE_FILTERS} from "@/constants/tasks.constants";

import {useOrganization} from "@/src/context/OrganizationContext";
import {useModifyTask} from "./useModifyTask";

export function useDragAndDropTasks() {
    const {organizationId} = useOrganization();
    // Зміна назви хуку для унікальності
    const {modifyTask} = useModifyTask(); // Зміна назви функції, що повертається

    const handleDragEnd = (result: DropResult) => {
        // Зміна назви функції для унікальності
        if (!result.destination) return;

        const targetColumnId = result.destination.droppableId; // Зміна назви змінної для унікальності

        if (targetColumnId === result.source.droppableId) return;

        if (targetColumnId === "completed") {
            modifyTask({
                // Зміна назви функції
                taskId: result.draggableId, // Зміна назви параметра
                data: {
                    organizationId,
                    // Зміна назви параметра
                    isCompleted: true,
                },
            });

            return;
        }

        const newCreatedAt = DATE_FILTERS[targetColumnId].format(); // Зміна назви змінної для унікальності

        if (organizationId) {
            modifyTask({
                taskId: result.draggableId, // Зміна назви параметра
                data: {
                    organizationId,
                    createdAt: newCreatedAt as unknown as Date,
                    isCompleted: false,
                },
            });
        }
    };

    return {handleDragEnd}; // Зміна назви функції, що повертається
}
