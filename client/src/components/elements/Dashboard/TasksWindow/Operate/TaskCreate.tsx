import { Button, Field, Select } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useCreateTask } from "@/hooks/tasks/useCreateTask";
import { useFetchTeamsByProject } from "@/hooks/team/useFetchTeamsByProject";
import { useFetchUsersTeam } from "@/hooks/team/useFetchUsersTeam";
import {
  EnumTaskPriority,
  EnumTaskStatus,
  TaskFormData,
  TaskResponse,
} from "@/types/task.types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import styles from "./TaskOperate.module.scss";

interface TaskCreate {
  updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Function to update the list of tasks in parent state
  filterDate: string | undefined; // Optional date filter for created tasks
  projectId: string | undefined; // Optional current project ID to associate the task with
}

/**
 * TaskCreate component provides a form interface for creating a new task within a project.
 * It manages task details input, including title, description, status, priority, team, and assignee.
 *
 * @param {Object} props - Component props
 * @param {Dispatch<SetStateAction<TaskResponse[] | undefined>>} props.updateTaskList - Callback to update task list on creation
 * @param {string | undefined} props.filterDate - Optional filter date for task creation
 * @param {string | undefined} props.projectId - Optional project ID the task belongs to
 * @returns {JSX.Element}
 */
export default function TaskCreate({
  updateTaskList,
  filterDate,
  projectId,
}: TaskCreate) {
  // State to track the currently selected team ID
  const [teamsSelected, setTeamSelected] = useState<string>();
  // Retrieve current organization ID from context
  const { organizationId } = useOrganization();
  // Fetch list of teams associated with the given organization and project
  const { teamList } = useFetchTeamsByProject(organizationId, projectId);
  // Fetch users belonging to the selected team with refetch handler
  const { teamUsers, handleRefetch: refetchTeamUsers } = useFetchUsersTeam({
    organizationId,
    id: teamsSelected,
  });

  // Extract priority and status enums as arrays for dropdown options
  const priority = Object.values(EnumTaskPriority);
  const status = Object.values(EnumTaskStatus);

  // Hook providing task creation function
  const { createTask } = useCreateTask();
  // React Hook Form instance for form state management and validation
  const { register, handleSubmit, setValue, reset } = useForm<TaskFormData>({
    mode: "onChange",
  });

  // Effect to set default form values when filterDate or projectId changes
  useEffect(() => {
    filterDate && setValue("createdAt", filterDate as unknown as Date);
    projectId && setValue("projectId", projectId);
  }, [filterDate, projectId, setValue]);

  // Effect to set organizationId in the form when it becomes available
  useEffect(() => {
    organizationId && setValue("organizationId", organizationId);
  }, [organizationId, setValue]);

  /**
   * Updates the task list by appending a newly created task.
   *
   * @param {TaskResponse | undefined} data - Newly created task data
   */
  const handleCreateCard = (data?: TaskResponse) => {
    if (data)
      updateTaskList((previousTasks) => {
        return previousTasks ? [...previousTasks, data] : previousTasks;
      });
  };

  /**
   * Handler called when a team is selected from the dropdown.
   * Updates the form value and local state.
   *
   * @param {string} value - Selected team ID
   */
  const handleTeamSelect = (value: string) => {
    setValue("teamId", value); // Set selected team ID in form state
    setTeamSelected(value); // Update local selected team state
  };

  /**
   * Handler called when a priority is selected.
   * Updates the form value accordingly.
   *
   * @param {EnumTaskPriority} value - Selected task priority
   */
  const handlePrioritySelect = (value: EnumTaskPriority) => {
    setValue("priority", value); // Set task priority in form state
  };

  /**
   * Handler called when a task status is selected.
   * Updates the form value accordingly.
   *
   * @param {EnumTaskStatus} value - Selected task status
   */
  const handleStatusSelect = (value: EnumTaskStatus) => {
    setValue("taskStatus", value); // Set task status in form state
  };

  // Effect triggers refetch of team users whenever selected team changes
  useEffect(() => {
    teamsSelected && refetchTeamUsers();
  }, [teamsSelected, refetchTeamUsers]);

  /**
   * Handler called when a user is selected to assign the task.
   * Updates the form value accordingly.
   *
   * @param {string} value - Selected user ID
   */
  const handleUserSelect = (value: string) => {
    setValue("userId", value); // Set assigned user ID in form state
  };

  /**
   * Form submit handler to create a new task using the provided form data.
   * On successful creation, adds the task to the list and resets the form.
   *
   * @param {TaskFormData} data - Data submitted by the form
   */
  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    createTask(data, {
      onSuccess(data) {
        data && handleCreateCard(data); // Append new task to list
        reset(); // Reset form fields after success
      },
    });
  };

  return (
    <div className={styles["task-operate-window"]}>
      <div className={styles.info}>
        <div className={styles.title}>
          <h4>Creating a task</h4>
        </div>
        <div className={styles["text-block"]}>
          <p>
            This window allow you to create a new task within project and teams.
          </p>
        </div>
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Title input field with required validation */}
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
        {/* Description input field with max length validation */}
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
        {/* Status select dropdown, optional */}
        <Select
          id="status-select"
          placeholder="Choose status (Optional)"
          label="Select a status"
          options={status.map((item) => ({
            value: item,
            label: item,
          }))}
          onChange={(data) =>
            handleStatusSelect(data.target.value as EnumTaskStatus)
          }
          extra={styles["form__fields"]}
        />
        {/* Priority select dropdown, optional */}
        <Select
          id="priority-select"
          placeholder="Choose priority (Optional)"
          label="Select a priority"
          options={priority.map((item) => ({
            value: item,
            label: item,
          }))}
          onChange={(data) =>
            handlePrioritySelect(data.target.value as EnumTaskPriority)
          }
          extra={styles["form__fields"]}
        />
        {/* Team select dropdown rendered if teamList is available */}
        {teamList && (
          <Select
            id="team-select"
            placeholder="Select team"
            label="Select a team"
            options={teamList.inProject.map((item) => ({
              value: item.id,
              label: item.title,
            }))}
            onChange={(data) => handleTeamSelect(data.target.value)}
            extra={styles["form__fields"]}
          />
        )}
        {/* User select dropdown rendered if a team is selected and users are fetched */}
        {teamsSelected && teamUsers && (
          <Select
            id="team-user-select"
            label="Assign a performer"
            placeholder="Assign user to task (optional)"
            options={teamUsers.map((item) => ({
              value: item.user.id,
              label: item.user.name,
            }))}
            onChange={(data) => handleUserSelect(data.target.value)}
            extra={styles["form__fields"]}
          />
        )}
        <div className={styles.actions}>
          {/* Submit button to create task */}
          <Button type="button" block>
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}
