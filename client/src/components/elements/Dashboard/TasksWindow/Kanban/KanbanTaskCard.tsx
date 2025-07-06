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
import { CaretUp, ThumbsUp } from "@phosphor-icons/react/dist/ssr";

import styles from "./KanbanTaskCard.module.scss";

interface KanbanTaskCardProps {
  projectId: string; // ID of the project this task belongs to
  data: TaskResponse; // Task data object containing details about the task
  updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Function to update the list of tasks
  setDisableDnD: Dispatch<SetStateAction<boolean>>; // Function to enable/disable drag and drop globally
  handleRefetch: () => void; // Callback to trigger refetching of tasks from the server
}

/**
 * KanbanTaskCard component renders an individual task card in a Kanban board view.
 * It displays task details, status, and actions depending on user roles and permissions.
 *
 * @param {KanbanTaskCardProps} props - Component props
 * @param {TaskResponse} props.data - Task data to display on the card
 * @param {string} props.projectId - Project ID associated with the task
 * @param {Dispatch<SetStateAction<TaskResponse[] | undefined>>} props.updateTasks - Function to update task list state
 * @param {Dispatch<SetStateAction<boolean>>} props.setDisableDnD - Function to enable or disable drag and drop
 * @param {() => void} props.handleRefetch - Function to refetch tasks from the backend
 * @returns {JSX.Element | null} Kanban task card JSX element or null if no data
 */
export function KanbanTaskCard({
  data,
  updateTasks,
  projectId,
  setDisableDnD,
  handleRefetch,
}: KanbanTaskCardProps) {
  // State to track if drag and drop is disabled locally for this card
  const [DndDisabled, setDndDisabled] = useState<boolean>(false);

  // State to control visibility of the task details modal window
  const [showCardInfo, setShowCardInfo] = useState<boolean>(false);

  // State to track the current modal window mode: create, operate, or edit
  const [windowType, setWindowType] = useState<"create" | "operate" | "edit">(
    "operate"
  );

  // Get current organization ID from context
  const { organizationId } = useOrganization();

  // Fetch the current user's role in the organization
  const { organizationRole } = useFetchOrgRole(organizationId);

  // Fetch the current user's role in the project associated with this task
  const { projectRole } = useFetchProjectRole(data?.projectId, organizationId);

  // Fetch the current user's role in the team associated with this task
  const { teamRole } = useFetchTeamRole(data?.teamId, organizationId);

  // Determine if the current user has access rights to interact with this task
  const hasAccess = teamRole
    ? true // Access granted if user has any team role
    : organizationRole?.role === OrgRole.ADMIN || // Access for Admin or Owner organization roles
      organizationRole?.role === OrgRole.OWNER ||
      projectRole === ProjectRole.MANAGER; // Access for project managers

  /**
   * Toggles the visibility of the task details modal window,
   * and synchronizes drag and drop disable states locally and globally.
   */
  const showModalWindow = () => {
    setShowCardInfo(!showCardInfo);
    setDndDisabled(!DndDisabled);
    setDisableDnD(!DndDisabled);
  };

  // Format the task's updatedAt timestamp into a readable time string or undefined
  const time = data?.updatedAt
    ? formatTimestampToAmPm(data.updatedAt)
    : undefined;

  /**
   * Returns a JSX element representing the task status as an ASCII element icon.
   *
   * @returns {JSX.Element} Status icon component based on the task's current status
   */
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

      // Default to a loading icon if status is unknown or missing
      default:
        return <AsciiElement types="loading" />;
    }
  };

  return (
    // Only render if task data is available
    data && (
      <>
        {/* Task card container */}
        <div
          className={styles["task-kanban"]}
          // Open modal only if user has access rights
          onClick={() => hasAccess && showModalWindow()}
        >
          {/* Top bar displaying author and update time */}
          <div className={styles.topBar}>
            <div className={styles.author}>
              <p>
                <b>Author</b>:
                <br />
                {data.author?.name}
              </p>
            </div>
            <div className={styles.time}>
              <p>
                <b>
                  Time
                  <span>:</span>
                </b>
                {time}
              </p>
            </div>
          </div>

          {/* Main content area with title, description, and priority */}
          <div className={styles.content}>
            <div className={styles.title}>
              <h3>
                <b>
                  <span>Task:</span>
                </b>
                {data.title}
              </h3>
            </div>
            <div className={styles.description}>
              <p>{data.description}</p>
            </div>

            <div className={styles.priority}>
              <p>
                <b>Priority:</b> {toCapitalizeText(data.priority as string)}
              </p>
            </div>
          </div>

          {/* Conditional actions section visible only if user has access */}
          {hasAccess && (
            <div className={styles.actions}>
              {/* Complete action with thumbs up icon */}
              <div className={styles.comments}>
                <p>Complete</p>
                <ThumbsUp />
              </div>

              {/* Comments count with caret icon */}
              <div className={`${styles.comments} ${styles.lastComment}`}>
                <p>
                  Comments:
                  {data._count?.comments ? data._count.comments : 0}
                </p>
                <CaretUp />
              </div>
            </div>
          )}

          {/* Bottom bar displaying team name and task status */}
          <div className={styles.bottomBar}>
            <div className={styles.team}>
              <p>
                <b>Team:</b> {data.team?.title}
              </p>
            </div>
            <div className={styles.status}>
              <p>Status: </p> {returnStatus()}
            </div>
          </div>
        </div>

        {/* Modal window for operating on the task, shown when showCardInfo is true */}
        {showCardInfo && (
          <TaskOperate
            type={windowType} // Modal mode (create, operate, edit)
            switchType={setWindowType} // Function to change modal mode
            updateTaskList={updateTasks} // Function to update parent task list
            taskId={data.id} // Current task ID
            projectId={projectId} // Project ID
            data={data} // Full task data
            onClose={showModalWindow} // Callback to close the modal
            handleRefetch={handleRefetch} // Callback to refetch tasks externally
          />
        )}
      </>
    )
  );
}
