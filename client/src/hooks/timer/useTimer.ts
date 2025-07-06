import { useEffect, useState } from "react";

import type { TimerRoundResponse } from "@/types/timer.types";
import type { TimerState } from "@/types/timer.types";

import { useLoadSettings } from "./useLoadSettings";

/**
 * @function useTimer
 *
 * Custom React hook that manages a Pomodoro-style timer logic, alternating between work and break intervals.
 * It handles the countdown, switching modes (work/break), and managing timer state including the current round.
 *
 * This hook depends on user-specific timer settings (work and break durations) loaded via `useLoadSettings`.
 *
 * Timer updates once per second while running, and automatically switches between work and break intervals.
 *
 * @returns {TimerState} - The current timer state, including:
 * - `activeRound`: the current timer round (if any),
 * - `secondsLeft`: remaining seconds in the current interval,
 * - `setActiveRound`: setter to define the current round manually,
 * - `setIsRunning`: toggle for starting or stopping the timer,
 * - `setSecondsLeft`: manual setter for remaining time,
 * - `isRunning`: flag for whether the timer is active,
 * - `isDataLoaded`: flag for when user timer settings are loaded.
 *
 * @example
 * const {
 *   secondsLeft,
 *   setIsRunning,
 *   isRunning,
 *   setActiveRound
 * } = useTimer();
 *
 * useEffect(() => {
 *   if (secondsLeft === 0) {
 *     console.log("Time is up!");
 *   }
 * }, [secondsLeft]);
 */
export function useTimer(): TimerState {
  const { breakInterval, workInterval, isDataLoaded } = useLoadSettings();

  const [isRunning, setIsRunning] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(workInterval * 60);
  const [activeRound, setActiveRound] = useState<TimerRoundResponse>();

  // Update the timer when the workInterval setting changes
  useEffect(() => {
    setSecondsLeft(workInterval * 60);
  }, [workInterval]);

  // Countdown logic while timer is running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((secondsLeft) => secondsLeft - 1);
      }, 1000);
    } else if (!isRunning && secondsLeft !== 0 && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft, workInterval, activeRound]);

  // Switch between work and break intervals automatically
  useEffect(() => {
    if (secondsLeft > 0) return;

    setIsBreakTime(!isBreakTime);
    setSecondsLeft((isBreakTime ? workInterval : breakInterval) * 60);
  }, [secondsLeft, isBreakTime, workInterval, breakInterval]);

  return {
    activeRound,
    secondsLeft,
    setActiveRound,
    setIsRunning,
    setSecondsLeft,
    isRunning,
    isDataLoaded,
  };
}
