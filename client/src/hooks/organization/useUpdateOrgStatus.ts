import { orgService } from "@/src/services/org.service";
import { ManageOrgUser, OrgResponse } from "@/types/org.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to update a user's status within an organization.
 *
 * @returns {{
 *   updateStatus: (data: ManageOrgUser) => void;
 *   updatedStatus: OrgResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useUpdateOrgStatus() {
  // State to hold the updated organization response after mutation succeeds
  const [updatedStatus, setUpdatedStatus] = useState<OrgResponse | undefined>(
    undefined
  );

  // useMutation hook for updating user status in organization
  const { mutate: updateStatus, isPending } = useMutation({
    mutationKey: ["Update user status in organization"], // Unique key for this mutation
    mutationFn: (data: ManageOrgUser) =>
      orgService.updateStatusOrganization(data), // API call
    onSuccess: (data) => {
      toast.success("Successfully updated user status in organization!"); // Success toast
      setUpdatedStatus(data); // Update state with response data
    },
  });

  // Return the mutation function, updated data, and loading state
  return { updateStatus, updatedStatus, isPending };
}
