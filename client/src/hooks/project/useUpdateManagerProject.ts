import { projectService } from "@/src/services/project.service";
import { ProjectUsers } from "@/types/project.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to transfer the project manager role to another user.
 *
 * Handles the mutation request to update the project manager,
 * manages the updated manager state,
 * and shows a success toast notification when the transfer succeeds.
 *
 * @returns {{
 *   updateOwner: (params: { id: string; userId: string; organizationId: string }) => void;
 *   updatedManager: ProjectUsers | undefined;
 *   isPending: boolean;
 * }}
 */
export function useUpdateManagerProject() {
  // State to hold the updated project manager info after successful mutation
  const [updatedManager, setUpdatedManager] = useState<
    ProjectUsers | undefined
  >(undefined);

  // useMutation for the transfer manager API call
  const { mutate: updateOwner, isPending } = useMutation({
    mutationKey: ["Transfer project manager"], // Unique mutation key
    mutationFn: ({
      id,
      userId,
      organizationId,
    }: {
      id: string;
      userId: string;
      organizationId: string;
    }) => projectService.transferProjectManager({ id, userId, organizationId }),
    onSuccess: (data) => {
      toast.success("Successfully transferred manager of project!"); // Notify user on success
      setUpdatedManager(data); // Update local state with new manager info
    },
  });

  // Return the mutation function, updated manager state, and loading status
  return { updateOwner, updatedManager, isPending };
}
