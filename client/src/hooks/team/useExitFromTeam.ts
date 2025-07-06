import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { teamService } from "@/src/services/team.service";

/**
 * Custom hook to handle user exiting from a team.
 *
 * Provides mutation logic with React Query and tracks the exit state.
 *
 * @returns {{
 *   exitFromTeam: (id: string) => void;  // Function to trigger exit from a team by team ID
 *   isExited: boolean;                   // Flag indicating if the exit operation was successful
 *   isPending: boolean;                  // Flag indicating if the mutation is in progress
 * }}
 *
 * @example
 * const { exitFromTeam, isExited, isPending } = useExitFromTeam();
 * exitFromTeam("teamId123");
 */
export function useExitFromTeam() {
  // Local state to track if the user has successfully exited the team
  const [isExited, setIsExited] = useState<boolean>(false);

  // React Query mutation to call the exitFromTeam service method
  const { mutate: exitFromTeam, isPending } = useMutation({
    mutationKey: ["Exit team"],

    // Mutation function that calls the service to exit from the team by ID
    mutationFn: (id: string) => teamService.exitFromTeam(id),

    // On success, show a success toast and update the exit state
    onSuccess: () => {
      toast.success("Successfully exited from team!");
      setIsExited(true);
    },
  });

  return { exitFromTeam, isExited, isPending };
}
