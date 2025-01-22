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

export default function Timer() {
	const timerState = useTimer();

	const { isLoading, sessionsResponse, workInterval } =
		useTodaySession(timerState);

	const rounds = sessionsResponse?.rounds;
	const actions = useTimerActions({ ...timerState, rounds });

	const { isPending: isCreating, mutate: createSession } = useCreateSession();
	const { deleteSession, isDeleting } = useDeleteSession(() =>
		timerState.setSecondsLeft(workInterval * 60)
	);

	const handleSessionDeletion = () => {
		timerState.setIsRunning(false);
		sessionsResponse && deleteSession(sessionsResponse.id);
	};

	const handleSessionCreation = () => {
		createSession();
	};

	const handlePlayPause = () => {
		timerState.isRunning ? actions.pauseTimer() : actions.startTimer();
	};

	return (
		<div className={styles.timer}>
			<div className={styles.container}>
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
				<div className={styles.content}>
					<div className={styles["timer-counter"]}>
						{timerState.isDataLoaded ? (
							timeFormatter(timerState.secondsLeft)
						) : (
							<div className={pageStyles["workspace-not-loaded-coin"]}>
								<SpinnerGap />
							</div>
						)}
					</div>

					{!isLoading && sessionsResponse?.rounds ? (
						<div className={styles["timer-actions"]}>
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
							<div className={styles["timer-actions__item"]}>
								<div className={styles["timer-actions__title"]}>
									<h5>Playing:</h5>
								</div>
								<Button
									type="button"
									onClick={() => handlePlayPause()}
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
							<div className={styles["timer-actions__item"]}>
								<div className={styles["timer-actions__title"]}>
									<h5>Reset rounds:</h5>
								</div>
								<Button
									type="button"
									onClick={() => handleSessionDeletion()}
									disabled={isDeleting}
									modal
								>
									<ArrowsCounterClockwise size={16} />
								</Button>
							</div>
						</div>
					) : (
						timerState.isDataLoaded && (
							<Button
								type={"button"}
								onClick={() => handleSessionCreation()}
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
