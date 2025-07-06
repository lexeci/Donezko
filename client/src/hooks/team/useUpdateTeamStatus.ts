import { teamService } from "@/src/services/team.service";
import { ManageTeamUser, TeamUsersResponse } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to update the status of a team user.
 *
 * Uses React Query's `useMutation` to perform the status update,
 * and shows a toast notification on success.
 *
 * @returns {{
 *   updateStatus: (data: ManageTeamUser) => void;
 *   updatedStatus: TeamUsersResponse | undefined;
 *   isPending: boolean;
 * }} Mutation function, the last updated status response, and loading state.
 *
 * @example
 * const { updateStatus, isPending } = useUpdateTeamStatus();
 *
 * updateStatus({ userId: "123", status: "active" });
 */
export function useUpdateTeamStatus() {
  // State to store the response from the update operation
  const [updatedStatus, setUpdatedStatus] = useState<
    TeamUsersResponse | undefined
  >(undefined);

  // React Query mutation to call teamService.updateTeamStatus with given data
  // `isPending` indicates if the mutation is currently in progress
  const { mutate: updateStatus, isPending } = useMutation({
    mutationKey: ["Update team status"],
    mutationFn: (data: ManageTeamUser) => teamService.updateTeamStatus(data),
    onSuccess: (data) => {
      // Show success notification on successful update
      toast.success("Successfully updated team user status!");
      // Save the returned updated status response in local state
      setUpdatedStatus(data);
    },
  });

  return { updateStatus, updatedStatus, isPending };
}
