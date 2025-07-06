import { TaskResponse } from "@/types/task.types";
import { Dispatch, SetStateAction } from "react";
import { Comments, ModalWindow } from "@/components/index";
import TaskCreate from "./Operate/TaskCreate";
import TaskUpdate from "./Operate/TaskUpdate";
import TaskCreateInfo from "./Info/TaskCreateInfo";
import TaskUpdateInfo from "./Info/TaskUpdateInfo";
import TaskInfo from "./Info/TaskInfo";

import styles from "./TaskWindow.module.scss";

interface TaskOperate {
  /**
   * State setter for updating the task list.
   */
  updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;

  /**
   * Optional filter date string used for filtering tasks.
   */
  filterDate?: string | undefined;

  /**
   * Callback to close the modal or operation window.
   */
  onClose: () => void;

  /**
   * Operation type: create a new task, edit existing, or view/operate.
   */
  type: "create" | "edit" | "operate";

  /**
   * Optional setter to switch between operation types.
   */
  switchType?: Dispatch<SetStateAction<"create" | "edit" | "operate">>;

  /**
   * Optional project ID the task belongs to.
   */
  projectId?: string;

  /**
   * Optional task ID for editing or viewing.
   */
  taskId?: string;

  /**
   * Optional task data for editing or viewing.
   */
  data?: TaskResponse;

  /**
   * Callback to refetch tasks after operations.
   */
  handleRefetch: () => void;
}

/**
 * TaskOperate component manages task creation, editing, and detailed viewing.
 * It conditionally renders operation components and additional info or comments
 * based on the current operation type.
 *
 * @param {TaskOperate} props - Props object.
 * @returns {JSX.Element} Rendered task operation modal window.
 */
export default function TaskOperate({
  type,
  filterDate,
  onClose,
  updateTaskList,
  projectId,
  taskId,
  data,
  switchType,
  handleRefetch,
}: TaskOperate) {
  /**
   * Returns the main left content component depending on the operation type.
   */
  const returnLeftElement = () => {
    switch (type) {
      case "create":
        return (
          <TaskCreate
            filterDate={filterDate}
            updateTaskList={updateTaskList}
            projectId={projectId}
          />
        );

      case "edit":
        return (
          <TaskUpdate
            updateTaskList={updateTaskList}
            taskId={taskId}
            projectId={projectId}
            switchType={switchType}
            data={data}
            handleRefetch={handleRefetch}
          />
        );

      case "operate":
        return (
          <TaskInfo
            data={data}
            switchType={switchType}
            updateTaskList={updateTaskList}
            handleRefetch={handleRefetch}
            onClose={onClose}
          />
        );

      default:
        return <></>;
    }
  };

  /**
   * Returns the right content element with additional info or comments.
   */
  const returnRightElement = () => {
    switch (type) {
      case "create":
        return <TaskCreateInfo />;

      case "edit":
        return <TaskUpdateInfo />;

      case "operate":
        return <Comments taskId={taskId} />;

      default:
        return <p>Seems lonely there...</p>;
    }
  };

  return (
    <ModalWindow
      title="Task manager.exe"
      subtitle="Manage your task straight away"
      onClose={onClose}
    >
      <div className={styles["task-operate-container"]}>
        <div className={styles["task-operate-container__task-info"]}>
          {returnLeftElement()}
        </div>
        <div className={styles["task-operate-container__add-info"]}>
          {returnRightElement()}
        </div>
      </div>
    </ModalWindow>
  );
}
