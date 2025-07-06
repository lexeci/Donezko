import { teamService } from "@/src/services/team.service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to handle deleting a team.
 *
 * Uses React Query mutation and tracks deletion state.
 *
 * @returns {{
 *   deleteTeam: (params: { teamId: string; organizationId: string }) => void; // Function to trigger team deletion
 *   isDeleted: boolean;     // Flag indicating if the team was successfully deleted
 *   isPending: boolean;     // Flag indicating if the delete operation is in progress
 * }}
 *
 * @example
 * const { deleteTeam, isDeleted, isPending } = useDeleteTeam();
 * deleteTeam({ teamId: "team123", organizationId: "org456" });
 */
export function useDeleteTeam() {
  // State to track if deletion was successful
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  // React Query mutation for deleting the team
  const { mutate: deleteTeam, isPending } = useMutation({
    mutationKey: ["Delete team"],

    // Mutation function calling the service to delete the team by teamId and organizationId
    mutationFn: ({
      teamId,
      organizationId,
    }: {
      teamId: string;
      organizationId: string;
    }) => teamService.deleteTeam(teamId, organizationId),

    // On success, show toast notification and update local state
    onSuccess: () => {
      toast.success("Successfully deleted Team!");
      setIsDeleted(true);
    },
  });

  return { deleteTeam, isDeleted, isPending };
}
