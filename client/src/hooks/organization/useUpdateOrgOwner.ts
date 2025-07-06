import { orgService } from "@/src/services/org.service";
import { OrgUserResponse } from "@/types/org.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to update the owner of an organization.
 *
 * @returns {{
 *   updateOwner: (params: { id: string; orgUserId: string }) => void;
 *   updatedOwner: OrgUserResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useUpdateOrgOwner() {
  // State to store the updated organization owner after successful mutation
  const [updatedOwner, setUpdatedOwner] = useState<OrgUserResponse | undefined>(
    undefined
  );

  // useMutation to call API and update the owner of the organization
  const { mutate: updateOwner, isPending } = useMutation({
    mutationKey: ["Update owner organization"], // Unique key to identify this mutation
    mutationFn: ({ id, orgUserId }: { id: string; orgUserId: string }) =>
      orgService.updateOwnerOrganization(id, orgUserId), // API call to update owner
    onSuccess: (data) => {
      toast.success("Successfully updated owner of organization!"); // Show success message
      setUpdatedOwner(data); // Save the updated owner data to state
    },
  });

  // Return mutation function, updated data, and loading state
  return { updateOwner, updatedOwner, isPending };
}
