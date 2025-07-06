import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { timerService } from "@/services/timer.service";
import { TimerSessionResponse } from "@/src/types/timer.types";

/**
 * Custom React hook for creating a new timer session.
 *
 * This hook triggers a mutation via `timerService.createSession()` to start a new timer session,
 * stores the created session in local state, and invalidates the relevant cache to refresh data.
 *
 * Features:
 * - Uses React Query mutation to send session creation request.
 * - Automatically invalidates the "get today session" query after success to refetch updated session info.
 * - Stores the created session in `createdSession` state.
 *
 * @returns {{
 *   mutate: () => void,
 *   createdSession: TimerSessionResponse | undefined,
 *   isPending: boolean,
 *   isSuccess: boolean
 * }} - Returns the mutation function, created session, loading state, and success state.
 *
 * @example
 * const { mutate, createdSession, isPending, isSuccess } = useCreateSession();
 *
 * mutate(); // Call to start a new timer session
 *
 * if (isSuccess) {
 *   console.log("New session:", createdSession);
 * }
 */
export function useCreateSession() {
  const [createdSession, setCreatedSession] = useState<
    TimerSessionResponse | undefined
  >(undefined);
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["create new session"],
    mutationFn: () => timerService.createSession(),
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["get today session"],
      });
      setCreatedSession(data);
    },
  });

  return { mutate, createdSession, isPending, isSuccess };
}
