import { orgService } from "@/src/services/org.service";
import { OrgResponse } from "@/types/org.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch organization details by its ID.
 *
 * @param organizationId - The ID of the organization to fetch.
 * @returns An object containing:
 *  - organization: The fetched organization data or undefined.
 *  - setOrganization: Setter to manually update the organization state.
 *  - handleRefetch: Function to manually refetch the organization data.
 *  - isFetching: Boolean indicating if the query is currently fetching data.
 *  - isFetched: Boolean indicating if the query has completed at least once.
 */
export function useFetchOrgById(organizationId: string | null) {
  // Local state to store the organization data
  const [organization, setOrganization] = useState<OrgResponse | undefined>(
    undefined
  );

  // React Query hook to fetch organization by ID; enabled only when organizationId is truthy
  const {
    data: orgData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["organization", organizationId], // Unique key including organizationId
    queryFn: () => orgService.getOrganizationById(organizationId as string), // Fetch function
    enabled: !!organizationId, // Enable only if organizationId exists
  });

  // Update local state whenever fetched data changes
  useEffect(() => {
    if (orgData) {
      setOrganization(orgData);
    }
  }, [orgData]);

  // Function to manually refetch the organization data
  const handleRefetch = () => {
    refetch();
  };

  return {
    organization,
    setOrganization,
    handleRefetch,
    isFetching,
    isFetched,
  };
}
