import { projectService } from "@/src/services/project.service";
import { OrgUserResponse } from "@/types/org.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to remove a user from a project.
 *
 * Manages the mutation lifecycle, stores info about the removed user,
 * and shows a success toast notification upon completion.
 *
 * @returns {{
 *   removeUser: (params: { projectId: string; userId: string; organizationId: string }) => void;
 *   removedUser: OrgUserResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useRemoveProjectUser() {
  // State to hold the info of the user removed from the project
  const [removedUser, setRemovedUser] = useState<OrgUserResponse | undefined>(
    undefined
  );

  // useMutation hook for calling the remove user API endpoint
  const { mutate: removeUser, isPending } = useMutation({
    mutationKey: ["Remove project user"], // Unique key for mutation caching
    mutationFn: ({
      projectId,
      userId,
      organizationId,
    }: {
      projectId: string;
      userId: string;
      organizationId: string;
    }) =>
      projectService.removeUserToProject({
        id: projectId, // Map to expected parameter name
        userId,
        organizationId,
      }),
    onSuccess: (data) => {
      toast.success("Successfully removed user from project!"); // Notify user on success
      setRemovedUser(data); // Save removed user data in state
    },
  });

  // Return mutation function, removed user info, and loading state
  return { removeUser, removedUser, isPending };
}
