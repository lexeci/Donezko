import { DropResult } from "@hello-pangea/dnd";
import { DATE_FILTERS } from "@/constants/tasks.constants";
import { useOrganization } from "@/src/context/OrganizationContext";
import { useUpdateTask } from "./useUpdateTask";

/**
 * Custom hook to handle drag-and-drop task updates.
 *
 * It updates task completion status or creation date based on the drop destination,
 * then refetches tasks on successful update.
 *
 * @param {() => void} handleRefetch - Function to refetch tasks after mutation.
 * @returns {{ handleDragEnd: (result: DropResult) => void }}
 */
export function useDragAndDropTasks(handleRefetch: () => void) {
  const { organizationId } = useOrganization();

  // Mutation hook for updating tasks
  const { modifyTask } = useUpdateTask();

  /**
   * Handles the drag end event triggered by react-beautiful-dnd.
   * Updates the task status or createdAt date based on where the task was dropped.
   *
   * @param {DropResult} result - Result object from drag and drop event.
   */
  const handleDragEnd = (result: DropResult) => {
    // If dropped outside any droppable area, do nothing
    if (!result.destination) return;

    const destinationColumnId = result.destination.droppableId;

    // If dropped in the same column, do nothing
    if (destinationColumnId === result.source.droppableId) return;

    // If dropped into the "completed" column, mark task as completed
    if (destinationColumnId === "completed") {
      if (organizationId) {
        modifyTask(
          {
            taskId: result.draggableId,
            data: {
              organizationId,
              isCompleted: true,
            },
            organizationId,
          },
          {
            onSuccess: () => handleRefetch(),
          }
        );
      }
      return;
    }

    // For other columns, update createdAt date and mark task as not completed
    const newCreatedAt = DATE_FILTERS[destinationColumnId].format();

    if (organizationId) {
      modifyTask(
        {
          taskId: result.draggableId,
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

  return { handleDragEnd };
}
