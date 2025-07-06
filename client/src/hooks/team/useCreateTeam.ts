import { teamService } from "@/src/services/team.service";
import { TeamFormData, TeamsResponse } from "@/types/team.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to handle creating a new team.
 *
 * Provides mutation logic with React Query and tracks the created team data.
 *
 * @returns {{
 *   createTeam: (data: TeamFormData) => void;  // Function to trigger creating a team with form data
 *   newTeam: TeamsResponse | undefined;        // Newly created team data after success
 *   isPending: boolean;                         // Flag indicating if the create mutation is in progress
 * }}
 *
 * @example
 * const { createTeam, newTeam, isPending } = useCreateTeam();
 * createTeam({ name: "New Team", organizationId: "org123" });
 */
export function useCreateTeam() {
  const queryClient = useQueryClient();

  // Local state to store the newly created team response
  const [newTeam, setNewTeam] = useState<TeamsResponse | undefined>(undefined);

  // React Query mutation to create a new team
  const { mutate: createTeam, isPending } = useMutation({
    mutationKey: ["Create team"],

    // Calls the team service to create a team with given form data
    mutationFn: (data: TeamFormData) => teamService.createTeam(data),

    // On successful creation, show toast and update local state
    onSuccess: (data) => {
      toast.success("Successfully created team!");
      setNewTeam(data);

      // Optionally invalidate or refetch queries here to keep data fresh, e.g.:
      // queryClient.invalidateQueries(["teams for user"]);
    },
  });

  return { createTeam, newTeam, isPending };
}
