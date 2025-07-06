import { teamService } from "@/src/services/team.service";
import { TeamsProjectResponse } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch the list of teams associated with a specific project
 * within an organization.
 *
 * Uses React Query for data fetching and manages local state for the team list.
 *
 * @param {string | null | undefined} organizationId - The ID of the organization.
 * @param {string | null | undefined} projectId - The ID of the project.
 *
 * @returns {{
 *   teamList: TeamsProjectResponse | undefined; // Current list of teams for the project
 *   setTeamList: React.Dispatch<React.SetStateAction<TeamsProjectResponse | undefined>>; // Setter for the team list
 *   handleRefetch: () => void; // Function to manually refetch the teams data
 *   isFetching: boolean; // Indicates whether the query is currently fetching
 *   isFetched: boolean; // Indicates whether the query has completed at least once
 * }}
 *
 * @example
 * const { teamList, handleRefetch, isFetching } = useFetchTeamsByProject("org123", "proj456");
 */
export function useFetchTeamsByProject(
  organizationId?: string | null,
  projectId?: string | null
) {
  // Local state to hold fetched teams data
  const [teamList, setTeamList] = useState<TeamsProjectResponse | undefined>(
    undefined
  );

  // React Query to fetch teams by project, only enabled if both IDs are provided
  const {
    data: teamsData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["teams by project", organizationId, projectId],
    queryFn: () =>
      teamService.getAllTeamsByProject(
        organizationId as string,
        projectId as string
      ),
    enabled: !!organizationId && !!projectId,
  });

  // Synchronize fetched data into local state
  useEffect(() => {
    if (teamsData) {
      setTeamList(teamsData);
    }
  }, [teamsData]);

  // Function to manually trigger a refetch of the teams data
  const handleRefetch = () => {
    refetch();
  };

  return { teamList, setTeamList, handleRefetch, isFetching, isFetched };
}
