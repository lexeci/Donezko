import { orgService } from "@/src/services/org.service";
import { OrgFormData, OrgResponse } from "@/types/org.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to update organization details.
 *
 * @returns {{
 *   updateOrganization: (params: { id: string; data: OrgFormData }) => void;
 *   updatedOrganization: OrgResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useUpdateOrg() {
  // State to hold the updated organization after mutation succeeds
  const [updatedOrganization, setUpdatedOrganization] = useState<
    OrgResponse | undefined
  >(undefined);

  // useMutation hook to trigger the updateOrganization API call
  const { mutate: updateOrganization, isPending } = useMutation({
    mutationKey: ["Update organization"], // Unique key identifying this mutation
    mutationFn: ({ id, data }: { id: string; data: OrgFormData }) =>
      orgService.updateOrganization(id, data), // API call to update the org
    onSuccess: (data) => {
      toast.success("Successfully updated organization!"); // Show success toast
      setUpdatedOrganization(data); // Store updated org in state
    },
  });

  // Return mutation function, updated organization state, and loading status
  return { updateOrganization, updatedOrganization, isPending };
}
