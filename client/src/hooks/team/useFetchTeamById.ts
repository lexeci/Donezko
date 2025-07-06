import { teamService } from "@/src/services/team.service";
import { Team } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch a team by its ID within a given organization.
 *
 * Uses React Query to fetch data and manages local state for the team.
 *
 * @param {string} id - The ID of the team to fetch.
 * @param {string | null} organizationId - The organization ID the team belongs to.
 *
 * @returns {{
 *   team: Team | undefined;                            // The fetched team data or undefined
 *   setTeam: React.Dispatch<React.SetStateAction<Team | undefined>>;  // Setter for the team state
 *   handleRefetch: () => void;                         // Function to manually refetch the team data
 *   isFetching: boolean;                               // Whether the data is currently being fetched
 *   isFetched: boolean;                                // Whether the data has been fetched at least once
 * }}
 *
 * @example
 * const { team, handleRefetch, isFetching } = useFetchTeamById("team123", "org456");
 */
export function useFetchTeamById(id: string, organizationId: string | null) {
  // Local state to store the team data
  const [team, setTeam] = useState<Team | undefined>(undefined);

  // React Query hook to fetch the team data by ID, enabled only if organizationId is truthy
  const {
    data: teamData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["team", id, organizationId], // Query cache key includes team ID and org ID
    queryFn: () => teamService.getTeamById(id, organizationId as string),
    enabled: !!organizationId, // Only fetch if organizationId exists
  });

  // Sync fetched data into local state when it changes
  useEffect(() => {
    if (teamData) {
      setTeam(teamData);
    }
  }, [teamData]);

  // Function to manually trigger refetching of the team data
  const handleRefetch = () => {
    refetch();
  };

  return { team, setTeam, handleRefetch, isFetching, isFetched };
}
