import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { JoinOrgType, Organization } from "@/types/org.types";
import { orgService } from "@/src/services/org.service";
import { toast } from "sonner";

/**
 * Custom hook to handle joining an organization.
 *
 * @returns {{
 *   joinOrganization: (data: JoinOrgType) => void;
 *   joinedOrganization: Organization | undefined;
 *   isPending: boolean;
 * }}
 */
export function useJoinOrg() {
  // State to store the organization data after a successful join
  const [joinedOrganization, setJoinedOrganization] = useState<
    Organization | undefined
  >(undefined);

  // useMutation hook to perform the join organization API call
  const { mutate: joinOrganization, isPending } = useMutation({
    mutationKey: ["Join organization"], // Unique key for this mutation
    mutationFn: (data: JoinOrgType) => orgService.joinOrganization(data), // API call to join org
    onSuccess: (data) => {
      toast.success("Successfully joined organization!"); // Notify user of success
      setJoinedOrganization(data); // Save joined org data to state
    },
  });

  // Return mutation function, current joined organization, and loading status
  return { joinOrganization, joinedOrganization, isPending };
}
