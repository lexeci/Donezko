import { TaskResponse } from "@/types/task.types";
import { useState, type Dispatch, type SetStateAction } from "react";
import TaskOperate from "../TaskOperate";

import pageStyles from "../TaskWindow.module.scss";
import styles from "./ListRowView.module.scss";

interface ListAddRowInput {
  // Optional filter date to pre-set date in task creation
  filterDate?: string;
  // Function to update the task list state after adding a task
  updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
  // Project identifier where the task belongs
  projectId: string;
  // Callback to refetch tasks from the backend
  handleRefetch: () => void;
}

/**
 * AddCardInput component renders a button to open a modal for creating a new task.
 * When clicked, it toggles a modal window for task creation.
 *
 * @param {ListAddRowInput} props - Component props
 * @returns {JSX.Element}
 */
export default function AddCardInput({
  updateTaskList,
  filterDate,
  projectId,
  handleRefetch,
}: ListAddRowInput) {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  return (
    <div className={styles.addRow}>
      <button
        onClick={() => setShowCreateModal(true)}
        className={pageStyles["add-button"]}
      >
        Add task...
      </button>
      {showCreateModal && (
        <TaskOperate
          type="create"
          updateTaskList={updateTaskList}
          filterDate={filterDate}
          onClose={() => setShowCreateModal(false)}
          projectId={projectId}
          handleRefetch={handleRefetch}
        />
      )}
    </div>
  );
}
