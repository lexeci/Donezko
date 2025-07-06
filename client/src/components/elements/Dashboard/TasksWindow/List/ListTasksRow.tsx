import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Dispatch, SetStateAction, useState } from "react";

import type { TaskResponse } from "@/types/task.types";

import { DATE_FILTERS } from "@/constants/tasks.constants";
import { filterTasksByDate } from "@/utils/filterTasksByDate";

import AddCardInput from "./AddCardInput";
import ListRowCard from "./ListRowCard";
import styles from "./ListRowView.module.scss";

interface IListRowParent {
  // Unique identifier for this row (used as droppableId)
  value: string;
  // Display label for this row
  label: string;
  // List of task items associated with this row, or undefined if none
  items: TaskResponse[] | undefined;
  // State setter function to update the task list
  updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
  // Current project ID string
  projectId: string;
  // Callback function to trigger data refetch or refresh
  handleRefetch: () => void;
}

/**
 * ListRowParent component renders a droppable column for tasks filtered by date.
 * It displays task cards as draggable items, a column header, and an input to add new tasks.
 *
 * @param {IListRowParent} props - Component props
 * @param {string} props.value - Unique droppable identifier and filter key
 * @param {string} props.label - Column header label text
 * @param {TaskResponse[] | undefined} props.items - Array of tasks to display, or undefined
 * @param {Dispatch<SetStateAction<TaskResponse[] | undefined>>} props.updateTasks - Setter to update tasks state
 * @param {string} props.projectId - ID of the current project
 * @param {() => void} props.handleRefetch - Callback to refresh task data externally
 * @returns {JSX.Element}
 */
export function ListRowParent({
  value,
  items,
  label,
  updateTasks,
  projectId,
  handleRefetch,
}: IListRowParent) {
  // State to enable or disable drag-and-drop functionality dynamically
  const [disableDnD, setDisableDnD] = useState<boolean>(false);

  return (
    <Droppable droppableId={value}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {/* Column header with label */}
          <div className={styles.colHeading}>
            <div className="w-full">{label}</div>
          </div>

          {/* Render draggable task cards filtered by date using provided droppable context */}
          {filterTasksByDate(items, value)?.map((item, index) => (
            <Draggable
              key={item.id}
              draggableId={item.id}
              index={index}
              isDragDisabled={disableDnD} // Conditionally disable dragging
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {/* Individual task card with data and callbacks */}
                  <ListRowCard
                    key={item.id}
                    data={item}
                    projectId={projectId}
                    updateTasks={updateTasks}
                    handleRefetch={handleRefetch}
                    setDisableDnD={setDisableDnD} // Allow child to toggle drag-and-drop
                  />
                </div>
              )}
            </Draggable>
          ))}

          {/* Placeholder for droppable area to maintain layout during dragging */}
          {provided.placeholder}

          {/* Show AddCardInput component only if not in "completed" state and no new unsaved tasks */}
          {value !== "completed" && !items?.some((item) => !item.id) && (
            <AddCardInput
              updateTaskList={updateTasks} // Setter to add new tasks to list
              filterDate={
                DATE_FILTERS[value] ? DATE_FILTERS[value].format() : undefined
              }
              projectId={projectId}
              handleRefetch={handleRefetch}
            />
          )}
        </div>
      )}
    </Droppable>
  );
}
