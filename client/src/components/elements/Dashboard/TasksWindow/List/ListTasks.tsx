"use client";

import { DragDropContext } from "@hello-pangea/dnd";

import { TASK_COLUMNS } from "@/constants/tasks.constants";
import { useDragAndDropTasks } from "@/hooks/tasks/useDragAndDropTasks"; // Renamed hook for uniqueness

import { TaskResponse } from "@/types/task.types";
import { Dispatch, SetStateAction } from "react";
import styles from "./ListRowView.module.scss";
import { ListRowParent } from "./ListTasksRow";

interface ListTaskView {
  // Optional list of tasks to display
  taskList?: TaskResponse[];
  // Setter function to update the list of tasks
  setTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
  // Current project identifier
  projectId: string;
  // Callback to refetch or refresh tasks externally
  handleRefetch: () => void;
}

/**
 * ListTaskView component wraps task columns inside DragDropContext.
 * It renders headers and a ListRowParent for each task column.
 *
 * @param {ListTaskView} props - Component props
 * @returns {JSX.Element}
 */
export function ListTaskView({
  taskList,
  setTaskList,
  projectId,
  handleRefetch,
}: ListTaskView) {
  // Custom hook providing the drag end handler for DnD
  const { handleDragEnd } = useDragAndDropTasks(handleRefetch);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.table}>
        {/* Table headers */}
        <div className={styles.header}>
          <div>Task name</div>
          <div>Author</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Date</div>
        </div>

        {/* Container for all task columns */}
        <div className={styles.parentsWrapper}>
          {TASK_COLUMNS.map((column) => (
            <ListRowParent
              key={column.value}
              value={column.value}
              label={column.label}
              items={taskList}
              projectId={projectId}
              updateTasks={setTaskList} // Pass state setter to update task list
              handleRefetch={handleRefetch}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
