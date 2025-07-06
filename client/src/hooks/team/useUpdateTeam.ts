import { teamService } from "@/src/services/team.service";
import { TeamFormData, TeamResponse } from "@/types/team.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to update a team entity.
 *
 * Performs the update via React Query's `useMutation`.
 * Shows a success toast notification on completion.
 * Keeps track of the updated team data in local state.
 *
 * @returns {{
 *   updateTeam: (args: { id: string; data: TeamFormData; organizationId: string }) => void;
 *   updatedTeam: TeamResponse | undefined;
 *   isPending: boolean;
 * }} Mutation function to call update, updated team data, and loading state.
 *
 * @example
 * const { updateTeam, isPending } = useUpdateTeam();
 *
 * updateTeam({
 *   id: "teamId",
 *   data: { name: "New Team Name", description: "Updated description" },
 *   organizationId: "orgId",
 * });
 */
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  // Local state to store the updated team response after mutation success
  const [updatedTeam, setUpdatedTeam] = useState<TeamResponse | undefined>(
    undefined
  );

  const { mutate: updateTeam, isPending } = useMutation({
    mutationKey: ["Update Team"],

    // Mutation function calls the team service to update the team by id and organizationId
    mutationFn: ({
      id,
      data,
      organizationId,
    }: {
      id: string;
      data: TeamFormData;
      organizationId: string;
    }) => teamService.updateTeam(id, data, organizationId),

    // On success, show a toast notification and update local state
    onSuccess: (data) => {
      toast.success("Successfully updated team!");
      setUpdatedTeam(data);

      // Optionally, invalidate queries here if you want to refresh cached team data:
      // queryClient.invalidateQueries({ queryKey: ["teams", organizationId] });
    },
  });

  return { updateTeam, updatedTeam, isPending };
}
