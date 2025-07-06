import { orgService } from "@/src/services/org.service";
import { OrgRole } from "@/types/org.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AccessStatus } from "@/types/root.types";

/**
 * Custom hook to fetch the role and access status of the current user in an organization.
 *
 * @param organizationId - The ID of the organization to fetch the role for.
 * @returns An object containing:
 *   - organizationRole: The user's role and access status within the organization (or undefined if not loaded).
 *   - setOrganizationRole: Setter to manually update the organization role state.
 *   - handleRefetch: Function to manually refetch the organization role data.
 *   - isFetching: Boolean indicating if the query is currently fetching data.
 *   - isFetched: Boolean indicating if the query has completed fetching at least once.
 *   - isError: Boolean indicating if the query resulted in an error.
 */
export function useFetchOrgRole(organizationId: string | null) {
  // Local state to hold the user's role and access status in the organization
  const [organizationRole, setOrganizationRole] = useState<
    { role: OrgRole; status: AccessStatus } | undefined
  >(undefined);

  // React Query to fetch the organization role, only enabled if organizationId is provided
  const {
    data: orgData,
    refetch,
    isFetching,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ["organization role", organizationId], // Unique query key including org ID
    queryFn: () => orgService.getOrganizationRole(organizationId as string), // Fetch function
    enabled: !!organizationId, // Enable query only if organizationId is truthy
  });

  // Sync local state with fetched data whenever orgData changes
  useEffect(() => {
    if (orgData) {
      setOrganizationRole(orgData);
    }
  }, [orgData]);

  // Function to manually trigger a refetch of the organization role
  const handleRefetch = () => {
    refetch();
  };

  // Return state, setters, and query status flags
  return {
    organizationRole,
    setOrganizationRole,
    handleRefetch,
    isFetching,
    isFetched,
    isError,
  };
}
