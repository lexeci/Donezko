import { useState, type Dispatch, type SetStateAction } from "react";

import type { TaskResponse } from "@/types/task.types";
import TaskOperate from "../TaskOperate";

import pageStyles from "../TaskWindow.module.scss";

interface AddCardInputProps {
  filterDate?: string; // Optional date filter for tasks to display or create
  updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Function to update the list of tasks
  projectId: string; // Current project ID for task association
  handleRefetch: () => void; // Callback to refetch task data after changes
}

/**
 * AddCardInput component renders a button that opens a modal to create a new task.
 * When the button is clicked, it toggles a modal window for task creation.
 *
 * @param {Object} props - Component props
 * @param {Dispatch<SetStateAction<TaskResponse[] | undefined>>} props.updateTaskList - Function to update the task list state
 * @param {string} [props.filterDate] - Optional date filter for tasks
 * @param {string} props.projectId - Identifier of the current project
 * @param {() => void} props.handleRefetch - Function to refetch tasks after creation
 * @returns {JSX.Element}
 */
export function AddCardInput({
  updateTaskList,
  filterDate,
  projectId,
  handleRefetch,
}: AddCardInputProps) {
  // State to control visibility of the create task modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  return (
    <div className="mt-5">
      {/* Button to open the task creation modal */}
      <button
        onClick={() => setShowCreateModal(true)}
        className={pageStyles["add-button"]}
      >
        Add task...
      </button>

      {/* Render TaskOperate component as a modal when showCreateModal is true */}
      {showCreateModal && (
        <TaskOperate
          type="create"
          updateTaskList={updateTaskList}
          filterDate={filterDate}
          onClose={() => setShowCreateModal(false)} // Close modal handler
          projectId={projectId}
          handleRefetch={handleRefetch}
        />
      )}
    </div>
  );
}
