import { projectService } from "@/src/services/project.service";
import { OrgUserResponse } from "@/types/org.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to add a user to a project.
 *
 * @returns {{
 *   addUser: (params: { projectId: string; userId: string; organizationId: string }) => void;
 *   addedUser: OrgUserResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useAddProjectUser() {
  // State to store the user data returned after successfully adding the user
  const [addedUser, setAddedUser] = useState<OrgUserResponse | undefined>(
    undefined
  );

  // Mutation to add a user to a project via projectService
  const { mutate: addUser, isPending } = useMutation({
    mutationKey: ["Add user to project"], // Unique mutation key
    mutationFn: ({
      projectId,
      userId,
      organizationId,
    }: {
      projectId: string;
      userId: string;
      organizationId: string;
    }) =>
      projectService.addUserToProject({
        id: projectId,
        userId,
        organizationId,
      }),
    onSuccess: (data) => {
      toast.success("Successfully added user!"); // Show success toast notification
      setAddedUser(data); // Update state with added user data
    },
  });

  // Return the mutation function, added user data, and loading state
  return { addUser, addedUser, isPending };
}
