import { orgService } from "@/src/services/org.service";
import { Organization, OrgFormData } from "@/types/org.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to create a new organization.
 *
 * @returns An object containing:
 *  - createOrganization: Function to trigger the creation mutation with form data.
 *  - newOrganization: The newly created organization data.
 *  - isPending: Boolean indicating if the creation mutation is in progress.
 */
export function useCreateOrg() {
  // State to store the newly created organization data
  const [newOrganization, setNewOrganization] = useState<
    Organization | undefined
  >(undefined);

  // useMutation hook for creating an organization
  const { mutate: createOrganization, isPending } = useMutation({
    mutationKey: ["Create organization"], // Unique mutation key
    mutationFn: (data: OrgFormData) => orgService.createOrganization(data), // API call to create organization
    onSuccess: (data) => {
      // Show success notification on successful creation
      toast.success("Successfully created organization!");
      // Save the created organization in local state
      setNewOrganization(data);
    },
  });

  // Return the mutate function, created data, and loading state
  return { createOrganization, newOrganization, isPending };
}
