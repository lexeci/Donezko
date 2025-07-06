import { teamService } from "@/src/services/team.service";
import { ManageTeamUser } from "@/types/team.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to remove a user from a team.
 *
 * Uses React Query's `useMutation` to perform the removal operation.
 * Shows a success toast notification upon successful removal.
 * Tracks the removal state in local state.
 *
 * @returns {{
 *   removeUser: (data: ManageTeamUser) => void;
 *   isUserRemoved: boolean;
 *   isPending: boolean;
 * }} Mutation function to trigger removal, boolean flag indicating
 * if the user was removed successfully, and loading state.
 *
 * @example
 * const { removeUser, isUserRemoved, isPending } = useRemoveUserFromTeam();
 *
 * removeUser({ teamId: "team123", userId: "user456" });
 */
export function useRemoveUserFromTeam() {
  // Access React Query's QueryClient for cache invalidation if needed
  const queryClient = useQueryClient();

  // Local state to track if the user has been removed successfully
  const [isUserRemoved, setIsUserRemoved] = useState(false);

  // Mutation setup for removing a user from a team
  const { mutate: removeUser, isPending } = useMutation({
    mutationKey: ["Remove user from team"],

    // Calls the team service method to remove user
    mutationFn: (data: ManageTeamUser) => teamService.removeUserFromTeam(data),

    // On success: show toast and update local removal state
    onSuccess: () => {
      toast.success("Successfully removed user from team!");
      setIsUserRemoved(true);

      // Optional: Invalidate or refetch related queries to update UI
      // queryClient.invalidateQueries(['getTeamUsers']);
    },
  });

  return { removeUser, isUserRemoved, isPending };
}
