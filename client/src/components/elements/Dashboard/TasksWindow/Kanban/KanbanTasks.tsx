"use client";

import { DragDropContext } from "@hello-pangea/dnd";

import { TASK_COLUMNS } from "@/constants/tasks.constants";
import { useDragAndDropTasks } from "@/hooks/tasks/useDragAndDropTasks"; // Custom hook for drag-and-drop logic

import { TaskResponse } from "@/types/task.types";
import { Dispatch, SetStateAction } from "react";
import { KanbanTaskColumn } from "./KanbanTaskColumn";
import styles from "./KanbanTaskView.module.scss";

interface KanbanTaskView {
  // Optional list of tasks to display in the Kanban board
  taskList?: TaskResponse[];
  // Setter function to update the task list state
  setTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
  // ID of the current project to scope tasks
  projectId: string;
  // Function to refetch tasks data from the backend
  handleRefetch: () => void;
}

/**
 * KanbanTaskView component renders a Kanban board with draggable task columns.
 * It uses DragDropContext to handle drag-and-drop events for task reordering.
 *
 * @param {Object} props - Component props
 * @param {TaskResponse[]} [props.taskList] - List of tasks to display on the board
 * @param {(TaskResponse[] | undefined) => void} props.setTaskList - Function to update the task list state
 * @param {string} props.projectId - Current project identifier
 * @param {() => void} props.handleRefetch - Callback to refetch task data from the server
 * @returns {JSX.Element}
 */
export function KanbanTaskView({
  taskList,
  setTaskList,
  projectId,
  handleRefetch,
}: KanbanTaskView) {
  // Hook providing handler function for drag end event
  const { handleDragEnd } = useDragAndDropTasks(handleRefetch);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* Container for Kanban columns */}
      <div className={styles.board}>
        {/* Map through predefined task columns and render KanbanTaskColumn components */}
        {TASK_COLUMNS.map((column) => (
          <KanbanTaskColumn
            key={column.value}
            value={column.value} // Column identifier
            label={column.label} // Column display name
            items={taskList} // Tasks to display in this column
            projectId={projectId} // Project scope for the tasks
            updateTasks={setTaskList} // Function to update tasks list state
            handleRefetch={handleRefetch} // Refetch callback for updated data
          />
        ))}
      </div>
    </DragDropContext>
  );
}
