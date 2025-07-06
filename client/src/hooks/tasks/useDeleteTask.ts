import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { taskService } from "@/src/services/task.service";

/**
 * Custom hook to delete a task by ID within an organization.
 *
 * Manages deletion status and shows toast notifications on success.
 *
 * @returns {{
 *   removeTask: (params: { taskId: string; organizationId: string }) => void;
 *   isDeleted: boolean;
 *   isPending: boolean;
 * }}
 */
export function useDeleteTask() {
  // Local state to track whether deletion was successful
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  // Mutation hook to call the deleteTask API endpoint
  const { mutate: removeTask, isPending } = useMutation({
    mutationKey: ["delete task"], // Unique mutation key for this action
    mutationFn: ({
      taskId,
      organizationId,
    }: {
      taskId: string;
      organizationId: string;
    }) => taskService.deleteTask({ taskId, organizationId }),
    onSuccess(data) {
      toast.success("Successfully deleted task!");
      setIsDeleted(data);
    },
  });

  return { removeTask, isDeleted, isPending };
}
