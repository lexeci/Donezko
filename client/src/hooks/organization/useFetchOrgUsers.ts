import { orgService } from "@/src/services/org.service";
import { OrgUserResponse } from "@/types/org.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface UseFetchOrgUsersParams {
  organizationId?: string | null;
  projectId?: string;
  teamId?: string;
  hideFromProject?: boolean;
  hideFromTeam?: boolean;
}

/**
 * Custom hook to fetch organization users with optional filters.
 *
 * @param params - Parameters to filter the users list:
 *  - organizationId: ID of the organization (required to enable query)
 *  - projectId: Filter users by project ID
 *  - teamId: Filter users by team ID
 *  - hideFromProject: If true, exclude users assigned to the project
 *  - hideFromTeam: If true, exclude users assigned to the team
 *
 * @returns An object containing:
 *  - organizationUserList: Array of organization users (or undefined)
 *  - setOrganizationUserList: Setter to manually update the users list
 *  - handleRefetch: Function to manually refetch the users data
 *  - isFetching: Boolean indicating if the query is currently fetching
 *  - isFetched: Boolean indicating if the query has finished fetching at least once
 */
export function useFetchOrgUsers({
  organizationId,
  projectId,
  teamId,
  hideFromProject,
  hideFromTeam,
}: UseFetchOrgUsersParams) {
  // Local state to hold the list of organization users
  const [organizationUserList, setOrganizationUserList] = useState<
    OrgUserResponse[] | undefined
  >(undefined);

  // useQuery hook to fetch users with the given filters, enabled only if organizationId exists
  const {
    data: orgData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["organization users", organizationId],
    queryFn: () =>
      orgService.getOrganizationUsers(
        organizationId as string,
        projectId,
        hideFromProject,
        teamId,
        hideFromTeam
      ),
    enabled: !!organizationId,
  });

  // Update local state whenever fetched data changes
  useEffect(() => {
    if (orgData) {
      setOrganizationUserList(orgData);
    }
  }, [orgData]);

  // Function to manually trigger refetching of data
  const handleRefetch = () => {
    refetch();
  };

  // Return the users list, setter, refetch function, and loading states
  return {
    organizationUserList,
    setOrganizationUserList,
    handleRefetch,
    isFetching,
    isFetched,
  };
}
