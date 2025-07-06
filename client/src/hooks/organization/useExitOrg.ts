import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { orgService } from "@/src/services/org.service";
import { toast } from "sonner";

/**
 * Custom hook to handle exiting from an organization.
 *
 * @returns An object containing:
 *  - exitOrganization: Function to trigger exit mutation with the organization ID.
 *  - exitedOrganizationId: The ID of the organization that was successfully exited.
 *  - isPending: Boolean indicating whether the exit mutation is in progress.
 */
export function useExitOrg() {
  // Local state to store the ID of the organization that the user has exited
  const [exitedOrganizationId, setExitedOrganizationId] = useState<
    string | undefined
  >(undefined);

  // useMutation hook to call the API for exiting an organization
  const { mutate: exitOrganization, isPending } = useMutation({
    mutationKey: ["Exit organization"], // Unique mutation key
    mutationFn: (id: string) => orgService.exitOrganization(id), // Mutation function calling the service
    onSuccess: (_, id) => {
      // Show success toast notification on successful exit
      toast.success("Successfully exited organization!");
      // Update state with the exited organization ID
      setExitedOrganizationId(id);
    },
  });

  // Return the mutation function, exited org ID, and pending status
  return { exitOrganization, exitedOrganizationId, isPending };
}
