import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Dispatch, SetStateAction, useState } from "react";

import type { TaskResponse } from "@/types/task.types";

import { DATE_FILTERS } from "@/constants/tasks.constants";
import { filterTasksByDate } from "@/utils/filterTasksByDate";

import { AddCardInput } from "./AddCardInput";
import { KanbanTaskCard } from "./KanbanTaskCard";
import styles from "./KanbanTaskView.module.scss";

interface KanbanTaskColumnProps {
  // Unique identifier for the column (used as droppableId)
  value: string;
  // Display label for the column header
  label: string;
  // Array of task items to display within this column
  items: TaskResponse[] | undefined;
  // Setter function to update the task list state
  updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
  // Current project identifier for task scoping
  projectId: string;
  // Callback function to refetch tasks data from the backend
  handleRefetch: () => void;
}

/**
 * KanbanTaskColumn component renders a single column within the Kanban board.
 * It displays a list of draggable task cards filtered by the column's value,
 * and optionally includes an input to add new tasks (except for the 'completed' column).
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Column identifier used as droppable ID
 * @param {string} props.label - Column header label
 * @param {TaskResponse[] | undefined} props.items - List of tasks to display in this column
 * @param {(TaskResponse[] | undefined) => void} props.updateTasks - Function to update task list state
 * @param {string} props.projectId - Project ID for task context
 * @param {() => void} props.handleRefetch - Callback to refetch task data
 * @returns {JSX.Element}
 */
export function KanbanTaskColumn({
  value,
  items,
  label,
  updateTasks,
  projectId,
  handleRefetch,
}: KanbanTaskColumnProps) {
  // Local state to disable drag-and-drop temporarily (e.g., while editing)
  const [disableDnD, setDisableDnD] = useState<boolean>(false);

  return (
    <Droppable droppableId={value}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {/* Column container */}
          <div className={styles.column}>
            {/* Column header with label */}
            <div className={styles.columnHeading}>{label}</div>

            {/* Container for task cards */}
            <div className={styles.container}>
              {/* Filter tasks by the current column and render as draggable cards */}
              {filterTasksByDate(items, value)?.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={disableDnD} // Disable dragging when needed
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <KanbanTaskCard
                        key={item.id}
                        data={item}
                        projectId={projectId}
                        updateTasks={updateTasks}
                        handleRefetch={handleRefetch}
                        setDisableDnD={setDisableDnD} // Pass setter to control drag state
                      />
                    </div>
                  )}
                </Draggable>
              ))}

              {/* Placeholder required by react-beautiful-dnd for proper spacing */}
              {provided.placeholder}

              {/* Conditionally render AddCardInput to add new tasks if not in 'completed' column
							    and there are no unsaved new tasks (checking no item with empty id) */}
              {value !== "completed" && !items?.some((item) => !item.id) && (
                <AddCardInput
                  updateTaskList={updateTasks} // Setter for updating task list
                  filterDate={
                    DATE_FILTERS[value]
                      ? DATE_FILTERS[value].format() // Format date filter string if available
                      : undefined
                  }
                  projectId={projectId}
                  handleRefetch={handleRefetch}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
}
