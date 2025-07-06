"use client";

import { Button, TimerRounds } from "@/components/index";
import { useCreateSession } from "@/src/hooks/timer/useCreateSession";
import { useDeleteSession } from "@/src/hooks/timer/useDeleteSession";
import { useTimer } from "@/src/hooks/timer/useTimer";
import { useTimerActions } from "@/src/hooks/timer/useTimerActions";
import { useTodaySession } from "@/src/hooks/timer/useTodaySession";
import { timeFormatter } from "@/utils/timeFormatter";
import {
  ArrowsCounterClockwise,
  Minus,
  Pause,
  Play,
  Square,
  X,
} from "@phosphor-icons/react";
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr";

import pageStyles from "@/app/page.module.scss";
import styles from "./Timer.module.scss";

/**
 * Timer component renders a Pomodoro timer with rounds navigation, play/pause, and session reset controls.
 *
 * It uses various hooks to manage timer state, session creation, deletion, and actions on rounds.
 *
 * @returns {JSX.Element} The timer UI component.
 */
export default function Timer() {
  // Get timer state (seconds, running status, active round, etc.)
  const timerState = useTimer();

  // Fetch today's session data including rounds and work interval
  const { isLoading, sessionsResponse, workInterval } =
    useTodaySession(timerState);

  const rounds = sessionsResponse?.rounds;

  // Get action handlers for timer rounds and timer control
  const actions = useTimerActions({ ...timerState, rounds });

  // Mutation hooks for creating and deleting sessions with loading state
  const { isPending: isCreating, mutate: createSession } = useCreateSession();
  const { deleteSession, isDeleting } = useDeleteSession(() =>
    timerState.setSecondsLeft(workInterval * 60)
  );

  // Handler for deleting the current session and stopping the timer
  const handleSessionDeletion = () => {
    timerState.setIsRunning(false);
    if (sessionsResponse) {
      deleteSession(sessionsResponse.id);
    }
  };

  // Handler for creating a new session
  const handleSessionCreation = () => {
    createSession();
  };

  // Toggles the timer between play and pause states
  const handlePlayPause = () => {
    timerState.isRunning ? actions.pauseTimer() : actions.startTimer();
  };

  return (
    <div className={styles.timer}>
      <div className={styles.container}>
        {/* Header with title and window action icons */}
        <div className={styles.header}>
          <div className={styles.title}>
            <h5>Pomodoro Timer.exe</h5>
          </div>
          <div className={styles.actions}>
            <div className={styles["item-1"]}>
              <Minus size={16} />
            </div>
            <div className={styles["item-2"]}>
              <Square size={16} />
            </div>
            <div className={styles["item-3"]}>
              <X size={16} />
            </div>
          </div>
        </div>

        {/* Main content area showing timer counter and controls */}
        <div className={styles.content}>
          {/* Timer countdown or loading spinner */}
          <div className={styles["timer-counter"]}>
            {timerState.isDataLoaded ? (
              timeFormatter(timerState.secondsLeft)
            ) : (
              <div className={pageStyles["workspace-not-loaded-coin"]}>
                <SpinnerGap />
              </div>
            )}
          </div>

          {/* If not loading and rounds available, show rounds controls */}
          {!isLoading && sessionsResponse?.rounds ? (
            <div className={styles["timer-actions"]}>
              {/* Rounds navigation */}
              <div className={styles["timer-actions__item"]}>
                <div className={styles["timer-actions__title"]}>
                  <h5>Rounds:</h5>
                </div>
                <TimerRounds
                  rounds={rounds}
                  nextRoundHandler={actions.moveToNextRound}
                  prevRoundHandler={actions.moveToPreviousRound}
                  activeRound={timerState.activeRound}
                />
              </div>

              {/* Play/Pause button */}
              <div className={styles["timer-actions__item"]}>
                <div className={styles["timer-actions__title"]}>
                  <h5>Playing:</h5>
                </div>
                <Button
                  type="button"
                  onClick={handlePlayPause}
                  disabled={actions.isUpdateRoundPending}
                  modal
                >
                  {timerState.isRunning ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                </Button>
              </div>

              {/* Reset rounds button */}
              <div className={styles["timer-actions__item"]}>
                <div className={styles["timer-actions__title"]}>
                  <h5>Reset rounds:</h5>
                </div>
                <Button
                  type="button"
                  onClick={handleSessionDeletion}
                  disabled={isDeleting}
                  modal
                >
                  <ArrowsCounterClockwise size={16} />
                </Button>
              </div>
            </div>
          ) : (
            // If data loaded but no session, show create session button
            timerState.isDataLoaded && (
              <Button
                type="button"
                onClick={handleSessionCreation}
                disabled={isCreating}
                negative
                block
              >
                Create session
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
