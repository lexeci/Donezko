import type { TimerRoundResponse, TimerState } from "@/types/timer.types";
import { useLoadSettings } from "./useLoadSettings";
import { useUpdateRound } from "./useUpdateRound";

type UseTimerActionsProps = TimerState & {
  rounds: TimerRoundResponse[] | undefined;
};

/**
 * @function useTimerActions
 *
 * Provides imperative timer control actions such as start, pause, skip to next round, or revert to a previous round.
 * Intended to be used with the `useTimer` state and a list of current timer rounds.
 *
 * Internally updates the current round's status and duration via the `useUpdateRound` hook.
 *
 * @param {UseTimerActionsProps} props - The timer state and rounds list.
 * @param {TimerRoundResponse | undefined} props.activeRound - Currently active round.
 * @param {Function} props.setIsRunning - Function to start or stop the timer.
 * @param {number} props.secondsLeft - Seconds remaining in the current round.
 * @param {TimerRoundResponse[] | undefined} props.rounds - All user timer rounds for the session.
 * @param {Function} props.setActiveRound - Function to set the currently active round.
 *
 * @returns {{
 *   isUpdateRoundPending: boolean,
 *   pauseTimer: () => void,
 *   startTimer: () => void,
 *   moveToNextRound: () => void,
 *   moveToPreviousRound: () => void
 * }} Timer action handlers and update status.
 *
 * @example
 * const {
 *   pauseTimer,
 *   startTimer,
 *   moveToNextRound,
 *   moveToPreviousRound,
 *   isUpdateRoundPending
 * } = useTimerActions({ ...timerState, rounds });
 *
 * <button onClick={pauseTimer}>Pause</button>
 */
export function useTimerActions({
  activeRound,
  setIsRunning,
  secondsLeft,
  rounds,
  setActiveRound,
}: UseTimerActionsProps) {
  const { workInterval } = useLoadSettings();
  const { isUpdateRoundPending, updateRound } = useUpdateRound();

  /**
   * Pause the timer and update the current round's `totalSeconds` and `isCompleted` status.
   */
  const pauseTimer = () => {
    setIsRunning(false);
    if (!activeRound?.id) return;

    updateRound({
      id: activeRound.id,
      data: {
        totalSeconds: secondsLeft,
        isCompleted: Math.floor(secondsLeft / 60) >= workInterval,
      },
    });
  };

  /**
   * Start the timer.
   */
  const startTimer = () => {
    setIsRunning(true);
  };

  /**
   * Mark the current round as completed and set totalSeconds to full work interval.
   */
  const moveToNextRound = () => {
    if (!activeRound?.id) return;

    updateRound({
      id: activeRound.id,
      data: {
        isCompleted: true,
        totalSeconds: workInterval * 60,
      },
    });
  };

  /**
   * Revert the last completed round to an incomplete state and make it active again.
   */
  const moveToPreviousRound = () => {
    if (!rounds || rounds.length === 0) return;

    const lastCompletedIndex = rounds
      .map((round) => round.isCompleted)
      .lastIndexOf(true);

    if (lastCompletedIndex === -1) return;

    const lastCompletedRound = rounds[lastCompletedIndex];

    updateRound(
      {
        id: lastCompletedRound.id,
        data: {
          isCompleted: false,
          totalSeconds: 0,
        },
      },
      {
        onSuccess: () => {
          setActiveRound(lastCompletedRound);
        },
      }
    );
  };

  return {
    isUpdateRoundPending,
    pauseTimer,
    startTimer,
    moveToNextRound,
    moveToPreviousRound,
  };
}
