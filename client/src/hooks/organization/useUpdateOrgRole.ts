import { orgService } from "@/src/services/org.service";
import { ManageOrgUser, OrgUserResponse } from "@/types/org.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to update a user's role within an organization.
 *
 * @returns {{
 *   updateRole: (data: ManageOrgUser) => void;
 *   updatedRole: OrgUserResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useUpdateOrgRole() {
  // State to hold the updated user role after mutation succeeds
  const [updatedRole, setUpdatedRole] = useState<OrgUserResponse | undefined>(
    undefined
  );

  // useMutation hook to call the orgService API for role update
  const { mutate: updateRole, isPending } = useMutation({
    mutationKey: ["Update user role in organization"], // Unique key for this mutation
    mutationFn: (data: ManageOrgUser) =>
      orgService.updateRoleOrganization(data), // API call
    onSuccess: (data) => {
      toast.success("Successfully updated user role in organization!"); // Show success notification
      setUpdatedRole(data); // Update state with the response data
    },
  });

  // Return mutation function, updated role data, and loading status
  return { updateRole, updatedRole, isPending };
}
