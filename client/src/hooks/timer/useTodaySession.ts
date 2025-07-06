import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { timerService } from "@/services/timer.service";
import type { TimerState } from "@/types/timer.types";
import { useLoadSettings } from "./useLoadSettings";

/**
 * Custom hook to fetch today's timer session data.
 * It retrieves the current session rounds and sets the active round and
 * remaining seconds accordingly.
 *
 * This hook relies on `useLoadSettings` to get the current user's work interval.
 *
 * @param {TimerState} param0 - Object containing timer state setters.
 * @param {(round: TimerRoundResponse | undefined) => void} param0.setActiveRound - Setter for the active round.
 * @param {(seconds: number) => void} param0.setSecondsLeft - Setter for seconds left in the active round.
 *
 * @returns {{
 *   sessionsResponse?: { rounds?: TimerRoundResponse[] };
 *   isLoading: boolean;
 *   workInterval: number;
 * }} The session data, loading state, and work interval duration.
 *
 * @example
 * const { sessionsResponse, isLoading, workInterval } = useTodaySession({
 *   setActiveRound,
 *   setSecondsLeft,
 * });
 */
export function useTodaySession({
  setActiveRound,
  setSecondsLeft,
}: TimerState) {
  // Load user settings such as workInterval (default work time in minutes)
  const { workInterval } = useLoadSettings();

  // Fetch today's session data using React Query
  const {
    data: sessionsResponse,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["get today session"],
    queryFn: () => timerService.getTodaySession(),
  });

  // Extract rounds from the fetched session data (if any)
  const rounds = sessionsResponse?.rounds;

  // When the data fetch is successful and rounds are available,
  // find the first active (not completed) round and update the state.
  useEffect(() => {
    if (isSuccess && rounds) {
      // Find the current active round (the first incomplete round)
      const currentActiveRound = rounds.find((round) => !round.isCompleted);
      setActiveRound(currentActiveRound);

      // If the active round has a recorded totalSeconds, update the timer accordingly
      if (currentActiveRound?.totalSeconds) {
        setSecondsLeft(currentActiveRound.totalSeconds);
      }
    }
  }, [isSuccess, rounds, setActiveRound, setSecondsLeft]);

  // Return session data, loading status, and the user's work interval setting
  return { sessionsResponse, isLoading, workInterval };
}
