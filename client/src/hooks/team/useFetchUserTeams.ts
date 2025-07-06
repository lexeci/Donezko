import { teamService } from "@/src/services/team.service";
import { TeamsResponse } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch the list of user teams for a given organization.
 *
 * It uses React Query's `useQuery` to fetch data from the API and manages
 * local state to store the team list. Also provides a refetch function.
 *
 * @param {string | null | undefined} organizationId - The ID of the organization to fetch teams for.
 * When falsy, the query will be disabled.
 *
 * @returns {{
 *   userTeamList: TeamsResponse[] | undefined;  // The current list of teams
 *   setUserTeamList: React.Dispatch<React.SetStateAction<TeamsResponse[] | undefined>>;  // Setter for the team list
 *   handleRefetch: () => void;  // Function to manually refetch the data
 *   isFetching: boolean;  // Loading state for the query
 *   isFetched: boolean;  // Whether the data has been fetched at least once
 * }}
 *
 * @example
 * const { userTeamList, handleRefetch, isFetching } = useFetchUserTeams("org123");
 */
export function useFetchUserTeams(organizationId?: string | null) {
  // Local state to hold the fetched teams list
  const [userTeamList, setUserTeamList] = useState<TeamsResponse[] | undefined>(
    undefined
  );

  // Use React Query to fetch the user's teams, enabled only if organizationId exists
  const {
    data: userTeamsData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["teams for user", organizationId], // Added orgId to key for cache correctness
    queryFn: () => teamService.getUserTeams(organizationId as string),
    enabled: !!organizationId,
  });

  // When query data changes, update local state with new teams list
  useEffect(() => {
    if (userTeamsData) {
      setUserTeamList(userTeamsData);
    }
  }, [userTeamsData]);

  // Function to manually trigger a refetch of the teams data
  const handleRefetch = () => {
    refetch();
  };

  return {
    userTeamList,
    setUserTeamList,
    handleRefetch,
    isFetching,
    isFetched,
  };
}
