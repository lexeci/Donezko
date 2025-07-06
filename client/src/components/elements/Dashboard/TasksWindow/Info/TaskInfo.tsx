import { NotFoundId } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { useFetchProjectRole } from "@/hooks/project/useFetchProjectRole";
import { useDeleteTask } from "@/hooks/tasks/useDeleteTask";
import { useUpdateTask } from "@/hooks/tasks/useUpdateTask";
import { useFetchTeamRole } from "@/hooks/team/useFetchTeamRole";
import { OrgRole } from "@/types/org.types";
import { ProjectRole } from "@/types/project.types";
import { TaskResponse } from "@/types/task.types";
import { TeamRole } from "@/types/team.types";
import { formatDateToDayMonthYear } from "@/utils/timeFormatter";
import { Alarm, Eye, FlagPennant, ThumbsDown } from "@phosphor-icons/react";
import {
  Cat,
  GitBranch,
  ThumbsUp,
  Trash,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Dispatch, SetStateAction } from "react";

import styles from "./TaskInfo.module.scss";

interface TaskInfo {
  data?: TaskResponse; // Task data to display
  switchType?: Dispatch<SetStateAction<"create" | "edit" | "operate">>; // Function to switch task view mode
  updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Function to update the task list state
  onClose: () => void; // Callback to close the task info panel
  handleRefetch: () => void; // Callback to refetch data after updates
}

/**
 * TaskInfo component displays detailed information about a task,
 * including author, status, priority, project, team, assignee,
 * and allows task completion toggle, editing, and deletion
 * based on user roles and permissions.
 *
 * @param {Object} props - Component properties
 * @param {TaskResponse} [props.data] - The task data object to display
 * @param {Dispatch<SetStateAction<"create" | "edit" | "operate">>} [props.switchType] - Function to change the task mode (e.g., edit)
 * @param {Dispatch<SetStateAction<TaskResponse[] | undefined>>} props.updateTaskList - Function to update the list of tasks
 * @param {() => void} props.onClose - Function to close the task info panel
 * @param {() => void} props.handleRefetch - Function to refetch task data after updates
 * @returns {JSX.Element} Rendered task information UI or NotFoundId component if no data
 */
export default function TaskInfo({
  data,
  switchType,
  updateTaskList,
  onClose,
  handleRefetch,
}: TaskInfo) {
  // Get current organization ID from context
  const { organizationId } = useOrganization();

  // Fetch roles for current user in organization, project, and team contexts
  const { organizationRole } = useFetchOrgRole(organizationId);
  const { projectRole } = useFetchProjectRole(data?.projectId);
  const { teamRole } = useFetchTeamRole(data?.teamId, organizationId);

  // Determine if user has sufficient access rights (org admin/owner or project manager)
  const hasAccess =
    organizationRole?.role === OrgRole.ADMIN ||
    organizationRole?.role === OrgRole.OWNER ||
    projectRole === ProjectRole.MANAGER;

  // Hooks for modifying and deleting tasks
  const { modifyTask } = useUpdateTask();
  const { removeTask } = useDeleteTask();

  /**
   * Updates a task card in the task list state with new data.
   * Calls refetch handler to reload data.
   *
   * @param {TaskResponse | undefined} data - Updated task data
   */
  const handleUpdateCard = (data?: TaskResponse) => {
    if (data) {
      updateTaskList((previousTasks) => {
        return previousTasks
          ? // Replace the matching task with updated data
            previousTasks.filter((item) => (item.id === data.id ? data : item))
          : previousTasks;
      });
      handleRefetch();
    }
  };

  /**
   * Removes a task card from the task list state by filtering it out.
   *
   * @param {TaskResponse | undefined} data - Task data to remove
   */
  const handleRemoveCard = (data?: TaskResponse) => {
    if (data) {
      updateTaskList((previousTasks) => {
        return previousTasks
          ? // Filter out the task with matching id
            previousTasks.filter((item) => item.id !== data.id && item)
          : previousTasks;
      });
    }
  };

  /**
   * Toggles the completion status of the current task by calling the modifyTask hook.
   * On success, updates the task card with new data.
   */
  const handleCompleteTask = () => {
    organizationId &&
      data &&
      modifyTask(
        {
          taskId: data.id,
          data: {
            organizationId,
            isCompleted: !data.isCompleted,
          },
          organizationId,
        },
        {
          onSuccess(data) {
            data && handleUpdateCard(data);
          },
        }
      );
  };

  /**
   * Deletes the current task by calling the removeTask hook.
   * On success, removes the task card and closes the panel.
   */
  const handleDeleteTask = () => {
    organizationId &&
      data &&
      removeTask(
        { taskId: data.id, organizationId },
        {
          onSuccess() {
            handleRemoveCard(data);
            onClose();
          },
        }
      );
  };

  // Determine if user is a team member or leader for limited permissions
  const isMember =
    teamRole?.role === TeamRole.MEMBER || teamRole?.role === TeamRole.LEADER;

  // Render task information if data is present
  return data ? (
    <div className={styles["task-info"]}>
      {/* Action buttons for completing task or editing */}
      <div className={styles.actions}>
        {/* Show complete toggle button if user has full access */}
        {hasAccess ? (
          <div
            className={styles["actions__btn"]}
            onClick={() => handleCompleteTask()}
          >
            <p>{!data.isCompleted ? "Complete" : "Not complete"}</p>
            {!data.isCompleted ? (
              <ThumbsUp size={16} />
            ) : (
              <ThumbsDown size={16} />
            )}
          </div>
        ) : (
          /* Show complete toggle button if user is a team member with limited rights */
          isMember && (
            <div
              className={styles["actions__btn"]}
              onClick={() => handleCompleteTask()}
            >
              <p>{!data.isCompleted ? "Complete" : "Not complete"}</p>
              {!data.isCompleted ? (
                <ThumbsUp size={16} />
              ) : (
                <ThumbsDown size={16} />
              )}
            </div>
          )
        )}
        {/* Show edit button only if user has full access */}
        {hasAccess && (
          <p
            className={styles["actions__btn"]}
            onClick={() => switchType && switchType("edit")}
          >
            Edit this
          </p>
        )}
      </div>

      {/* Main container displaying task details */}
      <div className={styles.container}>
        {/* Author information with icon */}
        <div className={styles["author-info"]}>
          <p>
            Author: <span>{data.author?.name}</span>
          </p>
          <Cat size={22} />
        </div>

        {/* Task status and priority information with icons */}
        <div className={styles["assign-info"]}>
          <div className={styles["assign-info__item"]}>
            <p>
              Task status: <span>{data.taskStatus || "No Status"}</span>
            </p>
            <FlagPennant size={22} />
          </div>
          <div className={styles["assign-info__item"]}>
            <p>
              Priority: <span>{data.priority || "No Priority"}</span>
            </p>
            <Alarm size={22} />
          </div>
        </div>

        {/* Project, team, and assignee information with icons */}
        <div className={styles["assign-info"]}>
          <div className={styles["assign-info__item"]}>
            <p>
              Project: <span>{data.project?.title || "No Project"}</span>
            </p>
            <GitBranch size={22} />
          </div>
          <div className={styles["assign-info__item"]}>
            <p>
              Team: <span>{data.team?.title || "No Team"}</span>
            </p>
            <UsersThree size={22} />
          </div>
          <div className={styles["assign-info__item"]}>
            <p>
              Assignee: <span>{data.user?.name || "No assignee"}</span>
            </p>
            <Eye size={22} />
          </div>
        </div>

        {/* Task title and description sections */}
        <div className={styles["task-info-details"]}>
          <div className={styles["task-info-details__title"]}>
            <h4>
              Title: <span>{data.title}</span>
            </h4>
          </div>
          <div className={styles["task-info-details__description"]}>
            <p className={styles["task-info-details__description__title"]}>
              Description:{" "}
            </p>
            <p>{data.description}</p>
          </div>
        </div>

        {/* Display creation and update dates if available */}
        {(data.createdAt || data.updatedAt) && (
          <div className="pb-4 w-full">
            <div className={styles["date-info"]}>
              {data.createdAt && (
                <p>
                  Created at: {formatDateToDayMonthYear(data.createdAt as Date)}
                </p>
              )}
              {data.updatedAt && (
                <p>
                  Updated since:{" "}
                  {formatDateToDayMonthYear(data.updatedAt as Date)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete task action available only for users with full access */}
      {hasAccess && (
        <div className={styles.actions}>
          <p>Do you want to delete a task {"-->"}</p>
          <div onClick={() => handleDeleteTask()}>
            <p>Delete</p>
            <Trash size={16} />
          </div>
        </div>
      )}
    </div>
  ) : (
    // Render not found component if no task data is provided
    <NotFoundId elementTitle={"Task"} />
  );
}
