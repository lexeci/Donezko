import { teamService } from "@/src/services/team.service";
import { ManageTeamUser, TeamUsersResponse } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to add a user to a team.
 *
 * Uses React Query mutation to perform the operation and manages local state of updated team users.
 *
 * @returns {{
 *   addUserToTeam: (data: ManageTeamUser) => void;  // Function to trigger adding a user to a team
 *   updatedTeam: TeamUsersResponse | undefined;     // Updated team users data after success
 *   isPending: boolean;                             // Flag indicating if the mutation is in progress
 * }}
 *
 * @example
 * const { addUserToTeam, updatedTeam, isPending } = useAddTeamUser();
 * addUserToTeam({ teamId: "team123", userId: "user456" });
 */
export function useAddTeamUser() {
  // Local state to hold updated team users response
  const [updatedTeam, setUpdatedTeam] = useState<TeamUsersResponse | undefined>(
    undefined
  );

  // React Query mutation to add a user to a team
  const { mutate: addUserToTeam, isPending } = useMutation({
    mutationKey: ["Add user to team"],

    // Mutation function calls teamService to add user to team
    mutationFn: (data: ManageTeamUser) => teamService.addUserToTeam(data),

    // On success, show a toast notification and update the local state
    onSuccess: (data) => {
      toast.success("Successfully added user!");
      setUpdatedTeam(data);
    },
  });

  return { addUserToTeam, updatedTeam, isPending };
}
