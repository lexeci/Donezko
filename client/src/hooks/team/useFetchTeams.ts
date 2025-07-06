import { teamService } from "@/src/services/team.service";
import { TeamsResponse } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch the list of teams for a given organization,
 * optionally filtered by project ID.
 *
 * Uses React Query for data fetching and local state to manage the team list.
 *
 * @param {string | null} organizationId - The ID of the organization.
 * @param {string | null | undefined} [projectId] - Optional project ID to filter teams.
 *
 * @returns {{
 *   teamList: TeamsResponse[] | undefined;             // Current list of teams
 *   setTeamList: React.Dispatch<React.SetStateAction<TeamsResponse[] | undefined>>; // Setter for the team list
 *   handleRefetch: () => void;                          // Function to manually refetch the teams
 *   isFetching: boolean;                                // Whether the query is currently loading
 *   isFetched: boolean;                                 // Whether the data has been fetched at least once
 * }}
 *
 * @example
 * const { teamList, handleRefetch, isFetching } = useFetchTeams("org123", "proj456");
 */
export function useFetchTeams(
  organizationId: string | null,
  projectId?: string | null
) {
  // Local state to hold the list of teams
  const [teamList, setTeamList] = useState<TeamsResponse[] | undefined>(
    undefined
  );

  // React Query hook to fetch teams data, enabled only if organizationId exists
  const {
    data: teamsData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["teams", organizationId, projectId], // Query key includes params for caching
    queryFn: () => teamService.getAllTeams(organizationId as string, projectId),
    enabled: !!organizationId, // Query enabled only when organizationId is truthy
  });

  // Sync fetched teams data to local state when it changes
  useEffect(() => {
    if (teamsData) {
      setTeamList(teamsData);
    }
  }, [teamsData]);

  // Function to manually trigger data refetch
  const handleRefetch = () => {
    refetch();
  };

  return { teamList, setTeamList, handleRefetch, isFetching, isFetched };
}
