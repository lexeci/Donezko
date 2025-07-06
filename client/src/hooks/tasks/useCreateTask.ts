import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { TaskFormData, TaskResponse } from "@/types/task.types";
import { taskService } from "@/src/services/task.service";

/**
 * Custom hook to create a new task.
 *
 * Manages the creation process, stores the created task,
 * and shows a success toast on completion.
 *
 * @returns {{
 *   createTask: (data: TaskFormData) => void;
 *   createdTask: TaskResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useCreateTask() {
  // State to hold the most recently created task
  const [createdTask, setCreatedTask] = useState<TaskResponse | undefined>(
    undefined
  );

  // useMutation hook to call the API for task creation
  const { mutate: createTask, isPending } = useMutation({
    mutationKey: ["create task"], // Unique key for this mutation
    mutationFn: (data: TaskFormData) => taskService.createTask(data),
    onSuccess(data) {
      toast.success("Successfully created task!");
      setCreatedTask(data);
    },
  });

  return { createTask, createdTask, isPending };
}
