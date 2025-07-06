import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { timerService } from "@/services/timer.service";
import { TypeTimerRoundState } from "@/types/timer.types";

/**
 * Custom hook to update a timer round on the server.
 *
 * Uses React Query's `useMutation` to perform the update,
 * and automatically invalidates the "get today session" query
 * to keep session data fresh after an update.
 *
 * @returns {{
 *   updateRound: (args: { id: string; data: TypeTimerRoundState }) => void;
 *   updatedRound: boolean | undefined;
 *   isUpdateRoundPending: boolean;
 * }} Mutation function, mutation state, and last update status.
 *
 * @example
 * const { updateRound, isUpdateRoundPending } = useUpdateRound();
 *
 * updateRound({ id: 'roundId', data: { isCompleted: true, totalSeconds: 1500 } });
 */
export function useUpdateRound() {
  // Local state to track the success status of the last update operation
  const [updatedRound, setUpdatedRound] = useState<boolean | undefined>(
    undefined
  );

  // React Query client for cache invalidation and query management
  const queryClient = useQueryClient();

  // Define the mutation for updating a timer round
  const { mutate: updateRound, isPending: isUpdateRoundPending } = useMutation({
    mutationKey: ["update round"],

    // Mutation function calls the timer service to update the round by id
    mutationFn: ({ id, data }: { id: string; data: TypeTimerRoundState }) =>
      timerService.updateRound(id, data),

    // On successful update, invalidate today's session query to refresh data
    // and update the local `updatedRound` state with the response (boolean)
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["get today session"] });
      setUpdatedRound(data);
    },
  });

  return { updateRound, updatedRound, isUpdateRoundPending };
}
