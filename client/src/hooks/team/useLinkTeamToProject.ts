import { teamService } from "@/src/services/team.service";
import { TeamsProjectResponse } from "@/types/team.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to link a team to a project within an organization.
 *
 * Uses React Query's `useMutation` to perform the linking operation.
 * Shows a success toast notification when the operation succeeds.
 * Tracks the linked team project response in local state.
 *
 * @returns {{
 *   linkTeamToProject: (params: { id: string; projectId: string; organizationId: string }) => void;
 *   linkedTeam: TeamsProjectResponse | undefined;
 *   isPending: boolean;
 * }} Mutation function to trigger linking, the latest linked team data,
 * and loading state of the mutation.
 *
 * @example
 * const { linkTeamToProject, linkedTeam, isPending } = useLinkTeamToProject();
 *
 * linkTeamToProject({ id: "team123", projectId: "proj456", organizationId: "org789" });
 */
export function useLinkTeamToProject() {
  const queryClient = useQueryClient();

  // State to store the linked team project response after successful linking
  const [linkedTeam, setLinkedTeam] = useState<
    TeamsProjectResponse | undefined
  >(undefined);

  // Mutation setup for linking a team to a project
  const { mutate: linkTeamToProject, isPending } = useMutation({
    mutationKey: ["Link user to team"],

    // Calls the team service API to link the team to a project within an organization
    mutationFn: ({
      id,
      projectId,
      organizationId,
    }: {
      id: string;
      projectId: string;
      organizationId: string;
    }) => teamService.linkToProject({ id, projectId, organizationId }),

    // On success, show toast and update local state with the linked team data
    onSuccess: (data) => {
      toast.success("Successfully linked user!");
      setLinkedTeam(data);

      // Optional: Invalidate relevant queries to keep cached data fresh
      // queryClient.invalidateQueries(['getTeamProjects']);
    },
  });

  return { linkTeamToProject, linkedTeam, isPending };
}
