import { useMutation } from "@tanstack/react-query";
import { TaskFormData, TaskResponse } from "@/types/task.types";
import { taskService } from "@/src/services/task.service";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to update a task.
 *
 * Provides mutation logic with React Query and tracks the updated task data.
 *
 * @returns {{
 *   modifyTask: (params: { taskId: string; organizationId: string; data: TaskFormData }) => void;
 *   updatedTask: TaskResponse | undefined;
 *   isPending: boolean;
 * }}
 *
 * @example
 * const { modifyTask, updatedTask, isPending } = useUpdateTask();
 * modifyTask({ taskId: "123", organizationId: "org456", data: { title: "New title" } });
 */
export function useUpdateTask() {
  // State to store the updated task response after successful mutation
  const [updatedTask, setUpdatedTask] = useState<TaskResponse | undefined>(
    undefined
  );

  // React Query mutation for updating the task
  const { mutate: modifyTask, isPending } = useMutation({
    mutationKey: ["update task"],

    // Mutation function accepts an object containing taskId, organizationId, and the updated data
    mutationFn: ({
      taskId,
      organizationId,
      data,
    }: {
      taskId: string;
      data: TaskFormData;
      organizationId: string;
    }) => taskService.updateTask({ id: taskId, data, organizationId }),

    // On successful update, show a toast notification and update local state
    onSuccess(data) {
      toast.success("Successfully updated task!");
      setUpdatedTask(data);
    },
  });

  return { modifyTask, updatedTask, isPending };
}
