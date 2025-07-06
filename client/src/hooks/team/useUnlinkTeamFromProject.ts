import { teamService } from "@/src/services/team.service";
import { TeamsProjectResponse } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to unlink a team from a project.
 *
 * Uses React Query's `useMutation` to perform the unlink operation.
 * Shows a success toast notification on success.
 * Stores the response of the unlink operation in local state.
 *
 * @returns {{
 *   unlinkTeamFromProject: (args: { id: string; projectId: string; organizationId: string }) => void;
 *   unlinkedTeam: TeamsProjectResponse | undefined;
 *   isPending: boolean;
 * }} Mutation function, unlink result, and loading state.
 *
 * @example
 * const { unlinkTeamFromProject, isPending } = useUnlinkTeamFromProject();
 *
 * unlinkTeamFromProject({ id: "teamId", projectId: "projId", organizationId: "orgId" });
 */
export function useUnlinkTeamFromProject() {
  // Local state to store the unlink result after mutation
  const [unlinkedTeam, setUnlinkedTeam] = useState<
    TeamsProjectResponse | undefined
  >(undefined);

  const { mutate: unlinkTeamFromProject, isPending } = useMutation({
    mutationKey: ["Unlink team from project"],

    // Mutation function calls the service to unlink the team from the project
    mutationFn: ({
      id,
      projectId,
      organizationId,
    }: {
      id: string;
      projectId: string;
      organizationId: string;
    }) => teamService.unlinkFromProject({ id, projectId, organizationId }),

    // On success, show toast and update local state
    onSuccess: (data) => {
      toast.success("Successfully unlinked team from project!");
      setUnlinkedTeam(data);
    },
  });

  return { unlinkTeamFromProject, unlinkedTeam, isPending };
}
