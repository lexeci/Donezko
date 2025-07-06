import { teamService } from "@/src/services/team.service";
import { TeamUsersResponse } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch the list of users belonging to a specific team
 * within an organization.
 *
 * Uses React Query for data fetching and local state to manage the team users list.
 *
 * @param {object} params - Parameters for the query
 * @param {string | null | undefined} params.organizationId - ID of the organization
 * @param {string | null | undefined} params.id - ID of the team
 *
 * @returns {{
 *   teamUsers: TeamUsersResponse[] | undefined;  // Current list of users in the team
 *   setTeamUsers: React.Dispatch<React.SetStateAction<TeamUsersResponse[] | undefined>>;  // Setter for the team users list
 *   handleRefetch: () => void;  // Function to manually trigger a refetch
 *   isFetching: boolean;  // Indicates if the query is currently loading
 *   isFetched: boolean;  // Indicates if the data has been fetched at least once
 * }}
 *
 * @example
 * const { teamUsers, handleRefetch, isFetching } = useFetchUsersTeam({ organizationId: "org123", id: "team456" });
 */
export function useFetchUsersTeam({
  organizationId,
  id,
}: {
  organizationId?: string | null;
  id?: string | null;
}) {
  // Local state to hold team users data
  const [teamUsers, setTeamUsers] = useState<TeamUsersResponse[] | undefined>(
    undefined
  );

  // React Query fetch call, enabled only if either organizationId or team id is provided
  const {
    data: teamUsersData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["team users", organizationId, id], // Include params in query key for caching
    queryFn: () =>
      teamService.getAllTeamUsers({
        organizationId: organizationId as string,
        id: id as string,
      }),
    enabled: !!organizationId && !!id, // Both organizationId and id should be truthy to enable
  });

  // Sync fetched data to local state
  useEffect(() => {
    if (teamUsersData) {
      setTeamUsers(teamUsersData);
    }
  }, [teamUsersData]);

  // Function to manually refetch the team users data
  const handleRefetch = () => {
    refetch();
  };

  return { teamUsers, setTeamUsers, handleRefetch, isFetching, isFetched };
}
