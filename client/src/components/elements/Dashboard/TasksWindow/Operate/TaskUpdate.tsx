import styles from "@/components/elements/Dashboard/TasksWindow/Operate/TaskOperate.module.scss";
import { Button, Field, Select } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchTeamsByProject } from "@/hooks/team/useFetchTeamsByProject";
import { useFetchUsersTeam } from "@/hooks/team/useFetchUsersTeam";
import { useUpdateTask } from "@/src/hooks/tasks/useUpdateTask";
import {
  EnumTaskPriority,
  EnumTaskStatus,
  TaskFormData,
  TaskResponse,
} from "@/types/task.types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface TaskUpdateProps {
  /**
   * Setter to update the task list state.
   */
  updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;

  /**
   * Optional task ID for updating.
   */
  taskId?: string;

  /**
   * Optional project ID for context.
   */
  projectId?: string;

  /**
   * Optional existing task data to prefill the form.
   */
  data?: TaskResponse;

  /**
   * Optional setter to switch the operation type view.
   */
  switchType?: Dispatch<SetStateAction<"create" | "edit" | "operate">>;

  /**
   * Callback to refetch task list after update.
   */
  handleRefetch: () => void;
}

/**
 * TaskUpdate component renders a form to update an existing task.
 * It handles loading teams and users, form state, and submitting the update.
 * @param {TaskUpdateProps} props - Props object.
 * @returns {JSX.Element} Rendered task update modal window.
 */
export default function TaskUpdate({
  updateTaskList,
  taskId,
  projectId,
  data: localData,
  switchType,
  handleRefetch,
}: TaskUpdateProps) {
  const [teamsSelected, setTeamSelected] = useState<string>();

  const { organizationId } = useOrganization();

  const { teamList } = useFetchTeamsByProject(organizationId, projectId);
  const { teamUsers, handleRefetch: refetchTeamUsers } = useFetchUsersTeam({
    organizationId,
    id: teamsSelected,
  });

  const priority = Object.values(EnumTaskPriority);
  const status = Object.values(EnumTaskStatus);

  const { modifyTask } = useUpdateTask();

  const { register, handleSubmit, setValue, reset } = useForm<TaskFormData>({
    mode: "onChange",
  });

  // Initialize form values from existing data on mount
  useEffect(() => {
    if (localData) {
      setValue("title", localData.title);
      setValue("description", localData.description);

      setValue("teamId", localData.teamId);
      setTeamSelected(localData.teamId);

      setValue("userId", localData.userId);

      // These two may require type assertion due to enum/string usage
      setValue("taskStatus", localData.taskStatus as EnumTaskStatus);
      setValue("priority", localData.priority as EnumTaskPriority);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update organizationId in form whenever it changes
  useEffect(() => {
    if (organizationId) {
      setValue("organizationId", organizationId);
    }
  }, [organizationId, setValue]);

  /**
   * Updates the task list by replacing the updated task.
   * Note: Fix the filter logic to replace the matching task.
   */
  const handleUpdateCard = (data?: TaskResponse) => {
    if (data) {
      updateTaskList((previousTasks) => {
        if (!previousTasks) return previousTasks;
        return previousTasks.map((item) => (item.id === data.id ? data : item));
      });
    }
  };

  // Handler for selecting team, sets form and local state
  const handleTeamSelect = (value: string) => {
    setValue("teamId", value);
    setTeamSelected(value);
  };

  // Handler for priority select
  const handlePrioritySelect = (value: EnumTaskPriority) => {
    setValue("priority", value);
  };

  // Handler for status select
  const handleStatusSelect = (value: EnumTaskStatus) => {
    setValue("taskStatus", value);
  };

  // Refetch users when selected team changes
  useEffect(() => {
    if (teamsSelected) {
      refetchTeamUsers();
    }
  }, [teamsSelected, refetchTeamUsers]);

  // Handler for user select
  const handleUserSelect = (value: string) => {
    setValue("userId", value);
  };

  // Form submission handler
  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    if (taskId && organizationId) {
      modifyTask(
        { taskId, organizationId, data },
        {
          onSuccess(updatedTask) {
            if (updatedTask) {
              handleUpdateCard(updatedTask);
              handleRefetch();
              reset(updatedTask);
            }
          },
        }
      );
    }
  };

  return (
    <div className={styles["task-operate-window"]}>
      <div className={styles["task-operate-window__actions"]}>
        <p
          role="button"
          tabIndex={0}
          onClick={() => switchType && switchType("operate")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              switchType && switchType("operate");
            }
          }}
        >
          Return to info
        </p>
      </div>
      <div className={styles.info}>
        <div className={styles.title}>
          <h4>Updating a task</h4>
        </div>
        <div className={styles["text-block"]}>
          <p>This window allows you to update a task.</p>
        </div>
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Field
          extra={styles["form__fields"]}
          id="title"
          label="Title:"
          placeholder="Enter title:"
          type="text"
          {...register("title", {
            required: "Title is required!",
          })}
        />
        <Field
          extra={styles["form__fields"]}
          id="description"
          label="Description:"
          placeholder="Enter description"
          type="text"
          {...register("description", {
            maxLength: { value: 500, message: "Description is too long" },
          })}
        />
        <Select
          id="status-select"
          placeholder="Choose status (Optional)"
          label="Select a status"
          options={status.map((item) => ({
            value: item,
            label: item,
          }))}
          onChange={(e) => handleStatusSelect(e.target.value as EnumTaskStatus)}
          extra={styles["form__fields"]}
        />
        <Select
          id="priority-select"
          placeholder="Choose priority (Optional)"
          label="Select a priority"
          options={priority.map((item) => ({
            value: item,
            label: item,
          }))}
          onChange={(e) =>
            handlePrioritySelect(e.target.value as EnumTaskPriority)
          }
          extra={styles["form__fields"]}
        />
        {teamList && (
          <Select
            id="team-select"
            placeholder="Select team"
            label="Select a team"
            options={teamList.inProject.map((item) => ({
              value: item.id,
              label: item.title,
            }))}
            onChange={(e) => handleTeamSelect(e.target.value)}
            extra={styles["form__fields"]}
          />
        )}
        {teamsSelected && teamUsers && (
          <Select
            id="team-user-select"
            label="Assign a performer"
            placeholder="Assign user to task (optional)"
            options={teamUsers.map((item) => ({
              value: item.user.id,
              label: item.user.name,
            }))}
            onChange={(e) => handleUserSelect(e.target.value)}
            extra={styles["form__fields"]}
          />
        )}
        <div className={styles.actions}>
          <Button type="submit" block>
            Update Task
          </Button>
        </div>
      </form>
    </div>
  );
}
