import { Dispatch, SetStateAction, useState } from "react";

import { AsciiElement } from "@/src/components/ui";
import type { TaskResponse } from "@/types/task.types";
import { formatTimestampToAmPm } from "@/utils/timeFormatter";

import TaskOperate from "@/components/elements/Dashboard/TasksWindow/TaskOperate";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { useFetchProjectRole } from "@/hooks/project/useFetchProjectRole";
import { useFetchTeamRole } from "@/hooks/team/useFetchTeamRole";
import { OrgRole } from "@/types/org.types";
import { ProjectRole } from "@/types/project.types";
import toCapitalizeText from "@/utils/toCapitalizeText";
import { DotsSixVertical } from "@phosphor-icons/react/dist/ssr";

import clsx from "clsx";
import styles from "./ListRowView.module.scss";

interface IListRow {
  // Project identifier
  projectId: string;
  // Task data to display
  data: TaskResponse;
  // Function to update tasks list state
  updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
  // Function to enable/disable drag and drop
  setDisableDnD: Dispatch<SetStateAction<boolean>>;
  // Callback to refetch tasks externally
  handleRefetch: () => void;
}

/**
 * ListRowCard component renders a single task row with drag handle and details.
 * It handles showing a modal with task operations on click, controlling drag state.
 *
 * @param {IListRow} props - Component props
 * @returns {JSX.Element | null}
 */
export default function ListRowCard({
  data,
  updateTasks,
  projectId,
  setDisableDnD,
  handleRefetch,
}: IListRow) {
  const [DndDisabled, setDndDisabled] = useState<boolean>(false);
  const [showCardInfo, setShowCardInfo] = useState<boolean>(false);
  const [windowType, setWindowType] = useState<"create" | "operate" | "edit">(
    "operate"
  );

  const { organizationId } = useOrganization();
  const { organizationRole } = useFetchOrgRole(organizationId);
  const { projectRole } = useFetchProjectRole(data?.projectId, organizationId);
  const { teamRole } = useFetchTeamRole(data?.teamId, organizationId);

  // Determine if the user has access to operate on this task
  const hasAccess = teamRole
    ? true
    : organizationRole?.role === OrgRole.ADMIN ||
      organizationRole?.role === OrgRole.OWNER ||
      projectRole === ProjectRole.MANAGER;

  // Toggles modal visibility and drag-and-drop disabling
  const showModalWindow = () => {
    setShowCardInfo(!showCardInfo);
    setDndDisabled(!DndDisabled);
    setDisableDnD(!DndDisabled);
  };

  // Format updated timestamp to AM/PM string or undefined
  const time = data?.updatedAt
    ? formatTimestampToAmPm(data.updatedAt)
    : undefined;

  // Returns a JSX element representing task status icon
  const returnStatus = () => {
    switch (data?.taskStatus) {
      case "NOT_STARTED":
        return <AsciiElement types="notStarted" />;
      case "IN_PROGRESS":
        return <AsciiElement types="progress" />;
      case "COMPLETED":
        return <AsciiElement types="completed" />;
      case "ON_HOLD":
        return <AsciiElement types="hold" />;
      default:
        return <AsciiElement types="loading" />;
    }
  };

  return (
    data && (
      <>
        <div
          className={clsx(
            styles.row,
            data.taskStatus ? styles.completed : "",
            "animation-opacity"
          )}
          onClick={() => hasAccess && showModalWindow()}
        >
          <div>
            <button aria-describedby="todo-item">
              <DotsSixVertical size={21} className={styles.grip} />
            </button>

            <div className="flex">
              <h3>
                <b>
                  <span>Task:</span>
                </b>
                {data.title}
              </h3>
            </div>
          </div>
          <div className={styles.author}>
            <p>
              <b>Author</b>:
              <br />
              {data.author?.name}
            </p>
          </div>
          <div className={styles.priority}>
            <p>
              <b>Priority:</b> {toCapitalizeText(data.priority as string)}
            </p>
          </div>
          <div className={styles.status}>{returnStatus()}</div>
          <div className={styles.time}>{time}</div>
        </div>
        {showCardInfo && (
          <TaskOperate
            type={windowType}
            switchType={setWindowType}
            updateTaskList={updateTasks}
            taskId={data.id}
            projectId={projectId}
            data={data}
            onClose={showModalWindow}
            handleRefetch={handleRefetch}
          />
        )}
      </>
    )
  );
}
