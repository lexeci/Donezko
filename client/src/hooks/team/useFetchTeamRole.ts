import { teamService } from "@/src/services/team.service";
import { TeamRole } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch the role of the current user within a specific team
 * and organization.
 *
 * Uses React Query for fetching and manages local state for the team role.
 *
 * @param {string | null | undefined} teamId - The ID of the team.
 * @param {string | null | undefined} organizationId - The ID of the organization.
 *
 * @returns {{
 *   teamRole: { role: TeamRole } | undefined;  // Current team role data
 *   setTeamRole: React.Dispatch<React.SetStateAction<{ role: TeamRole } | undefined>>; // Setter for team role
 *   handleRefetch: () => void;                  // Function to manually refetch the team role
 *   isFetching: boolean;                        // Indicates if fetching is in progress
 *   isFetched: boolean;                         // Indicates if data has been fetched at least once
 * }}
 *
 * @example
 * const { teamRole, handleRefetch, isFetching } = useFetchTeamRole("team123", "org456");
 */
export function useFetchTeamRole(
  teamId?: string | null,
  organizationId?: string | null
) {
  // Local state to store the team role data
  const [teamRole, setTeamRole] = useState<{ role: TeamRole } | undefined>(
    undefined
  );

  // React Query hook to fetch the team role, enabled only if teamId or organizationId exist
  const {
    data: teamData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["team role", teamId],
    queryFn: () =>
      teamService.getTeamRole({
        id: teamId as string,
        organizationId: organizationId as string,
      }),
    enabled: !!teamId || !!organizationId,
  });

  // Sync fetched data into local state when it changes
  useEffect(() => {
    if (teamData) {
      setTeamRole(teamData);
    }
  }, [teamData]);

  // Function to manually trigger refetching the team role
  const handleRefetch = () => {
    refetch();
  };

  return { teamRole, setTeamRole, handleRefetch, isFetching, isFetched };
}
