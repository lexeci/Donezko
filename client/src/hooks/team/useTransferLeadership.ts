import { teamService } from "@/src/services/team.service";
import { ManageTeamUser } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to transfer leadership of a team to another user.
 *
 * Utilizes React Query's `useMutation` to perform the leadership transfer operation.
 * Shows a success toast notification once the transfer is successful.
 * Tracks whether the leadership transfer has occurred via local state.
 *
 * @returns {{
 *   transferLeadership: (data: ManageTeamUser) => void;
 *   isLeadershipTransferred: boolean;
 *   isPending: boolean;
 * }} Mutation function to call transfer, boolean flag indicating transfer status,
 * and loading state of the mutation.
 *
 * @example
 * const { transferLeadership, isLeadershipTransferred, isPending } = useTransferLeadership();
 *
 * transferLeadership({ teamId: "team123", userId: "user456" });
 */
export function useTransferLeadership() {
  // State to track if leadership has been transferred successfully
  const [isLeadershipTransferred, setIsLeadershipTransferred] = useState(false);

  const { mutate: transferLeadership, isPending } = useMutation({
    mutationKey: ["Transfer team leadership"],

    // Mutation function calls the team service to transfer leadership
    mutationFn: (data: ManageTeamUser) => teamService.transferLeadership(data),

    // On success, show a success toast and update local state
    onSuccess: () => {
      toast.success("Successfully transferred team leadership!");
      setIsLeadershipTransferred(true);
    },
  });

  return { transferLeadership, isLeadershipTransferred, isPending };
}
