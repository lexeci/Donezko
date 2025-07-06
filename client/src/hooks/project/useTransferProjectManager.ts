import { projectService } from "@/src/services/project.service";
import { ProjectUsers } from "@/types/project.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to transfer the leadership (manager) role of a project to another user.
 *
 * Manages the mutation lifecycle, stores the updated manager info,
 * and provides user feedback via toast notifications.
 *
 * @returns {{
 *   transferManager: (params: { projectId: string; userId: string; organizationId: string }) => void;
 *   transferredManager: ProjectUsers | undefined;
 *   isPending: boolean;
 * }}
 */
export function useTransferProjectManager() {
  // State to hold the updated project manager after transfer is successful
  const [transferredManager, setTransferredManager] = useState<
    ProjectUsers | undefined
  >(undefined);

  // Mutation hook to call the API that transfers project leadership
  const { mutate: transferManager, isPending } = useMutation({
    mutationKey: ["Transfer project leadership"], // Unique key for caching and tracking mutation
    mutationFn: ({
      projectId,
      userId,
      organizationId,
    }: {
      projectId: string;
      userId: string;
      organizationId: string;
    }) =>
      projectService.transferProjectManager({
        id: projectId, // Mapping projectId to expected param name 'id'
        userId,
        organizationId,
      }),
    onSuccess: (data) => {
      // Notify the user on successful transfer
      toast.success("Successfully transferred leadership of project!");
      // Store the updated manager data locally
      setTransferredManager(data);
    },
  });

  // Return mutation function, updated manager, and loading status
  return { transferManager, transferredManager, isPending };
}
