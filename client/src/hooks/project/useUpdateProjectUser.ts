import { projectService } from "@/src/services/project.service";
import { ProjectResponse } from "@/types/project.types";
import { AccessStatus } from "@/types/root.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to update a user's access status in a project.
 *
 * Manages the mutation state and stores the updated project response.
 * Shows a success toast notification on successful update.
 *
 * @returns {{
 *   updateStatus: (params: {
 *     projectId: string;
 *     userId: string;
 *     status: AccessStatus;
 *     organizationId: string;
 *   }) => void;
 *   updatedStatus: ProjectResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useUpdateProjectUser() {
  // State to hold the project response after a successful update
  const [updatedStatus, setUpdatedStatus] = useState<
    ProjectResponse | undefined
  >(undefined);

  // useMutation hook for updating user status in the project
  const { mutate: updateStatus, isPending } = useMutation({
    mutationKey: ["update project user"], // Unique key for this mutation
    mutationFn: ({
      projectId,
      userId,
      status,
      organizationId,
    }: {
      projectId: string;
      userId: string;
      status: AccessStatus;
      organizationId: string;
    }) =>
      projectService.updateUserStatus({
        id: projectId,
        userId,
        status,
        organizationId,
      }),
    onSuccess: (data) => {
      toast.success("Successfully updated project user!");
      setUpdatedStatus(data);
    },
  });

  return { updateStatus, updatedStatus, isPending };
}
