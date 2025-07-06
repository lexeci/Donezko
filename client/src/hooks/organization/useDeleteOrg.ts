import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { orgService } from "@/src/services/org.service";
import { toast } from "sonner";

/**
 * Custom hook to delete an organization by its ID.
 *
 * @returns An object containing:
 *  - deleteOrganization: Function to trigger the delete mutation with an organization ID.
 *  - deletedOrganizationId: The ID of the organization successfully deleted.
 *  - isPending: Boolean indicating if the delete mutation is currently in progress.
 */
export function useDeleteOrg() {
  // State to keep track of which organization ID was deleted
  const [deletedOrganizationId, setDeletedOrganizationId] = useState<
    string | undefined
  >(undefined);

  // Mutation hook to handle deleting an organization
  const { mutate: deleteOrganization, isPending } = useMutation({
    mutationKey: ["Delete organization"], // Unique key for this mutation
    mutationFn: (id: string) => orgService.deleteOrganization(id), // API call to delete organization
    onSuccess: (_, id) => {
      // Show a success toast notification on successful deletion
      toast.success("Successfully deleted organization!");
      // Store the deleted organization ID in state
      setDeletedOrganizationId(id);
    },
  });

  // Return the mutation function, deleted org ID, and loading status
  return { deleteOrganization, deletedOrganizationId, isPending };
}
