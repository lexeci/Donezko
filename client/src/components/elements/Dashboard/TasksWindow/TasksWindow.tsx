import { WindowContainer } from "@/components/index";
import { TaskResponse } from "@/types/task.types";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";
import { KanbanTaskView } from "./Kanban/KanbanTasks";
import { ListTaskView } from "./List/ListTasks";

import styles from "./TaskWindow.module.scss";

interface TasksWindow {
  isPage?: boolean;
  isList?: boolean;
  taskList?: TaskResponse[];
  setTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
  projectId: string;
  handleRefetch: () => void;
}

/**
 * TasksWindow component renders a container displaying tasks either in Kanban or List view.
 * It optionally wraps the content in a WindowContainer if not rendered as a full page.
 *
 * @param {boolean} isPage - Flag indicating if the component is rendered as a full page.
 * @param {boolean} isList - Flag indicating whether to display tasks in list view (true) or Kanban view (false).
 * @param {TaskResponse[]} taskList - Array of tasks to display.
 * @param {Dispatch<SetStateAction<TaskResponse[] | undefined>>} setTaskList - Setter for taskList state.
 * @param {string} projectId - ID of the current project.
 * @param {() => void} handleRefetch - Callback to refetch the task list data.
 *
 * @returns {JSX.Element} The tasks window UI component.
 */
export default function TasksWindow({
  isPage,
  isList,
  taskList,
  setTaskList,
  projectId,
  handleRefetch,
}: TasksWindow) {
  // Render inside WindowContainer if not a full page; otherwise render in a div with styles
  return !isPage ? (
    <WindowContainer
      title="Insomnia Project"
      subtitle={`Tasks [${taskList?.length ?? 0}]`}
      fullPage
    >
      {!isList ? (
        <KanbanTaskView
          taskList={taskList}
          setTaskList={setTaskList}
          projectId={projectId}
          handleRefetch={handleRefetch}
        />
      ) : (
        <ListTaskView
          taskList={taskList}
          setTaskList={setTaskList}
          projectId={projectId}
          handleRefetch={handleRefetch}
        />
      )}
    </WindowContainer>
  ) : (
    <div className={clsx(styles["is-page"], "bg-radial-grid-small")}>
      {!isList ? (
        <KanbanTaskView
          taskList={taskList}
          setTaskList={setTaskList}
          projectId={projectId}
          handleRefetch={handleRefetch}
        />
      ) : (
        <ListTaskView
          taskList={taskList}
          setTaskList={setTaskList}
          projectId={projectId}
          handleRefetch={handleRefetch}
        />
      )}
    </div>
  );
}
