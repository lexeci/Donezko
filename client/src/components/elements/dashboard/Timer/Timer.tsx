"use client";

import { useCreateSession } from "@/hooks/timer/useCreateSession";
import { useDeleteSession } from "@/hooks/timer/useDeleteSession";
import { useTimer } from "@/hooks/timer/useTimer";
import { useTimerActions } from "@/hooks/timer/useTimerActions";
import { useTodaySession } from "@/hooks/timer/useTodaySession";
import { Button, TimerRounds } from "@/src/components";
import { timeFormatter } from "@/utils/timeFormatter";
import {
	ArrowsCounterClockwise,
	Minus,
	Pause,
	Play,
	Square,
	X,
} from "@phosphor-icons/react";

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
		<div className="relative h-[50vh] w-3/6 text-center flex flex-col justify-center items-center gap-3">
			<div className="container w-full h-full border-4 border-r-8 border-b-8 border-l-4 border-foreground gap-y-8 flex flex-col">
				<div className="header flex flex-row justify-between items-center w-full border-b-2 border-b-foreground">
					<div className="title pl-2">
						<h5>Pomodoro Timer.exe</h5>
					</div>
					<div className="actions flex flex-row">
						<div className="item p-1 border-x border-x-foreground">
							<Minus size={16} />
						</div>
						<div className="item p-1 border-r border-foreground">
							<Square size={16} />
						</div>
						<div className="item p-1">
							<X size={16} />
						</div>
					</div>
				</div>
				<div className="content h-full py-4 flex flex-col justify-between items-center gap-y-4">
					<div className="timer text-6xl font-bold my-auto">
						{timeFormatter(timerState.secondsLeft)}
					</div>

					{true ? (
						<div className="timer-actions flex-col justify-center items-center gap-x-4 w-full px-4">
							<div className="item w-full flex flex-row justify-between items-center border border-foreground p-2">
								<div className="title">
									<h5>Rounds:</h5>
								</div>
								<TimerRounds
									rounds={rounds}
									nextRoundHandler={actions.moveToNextRound}
									prevRoundHandler={actions.moveToPreviousRound}
									currentActiveRound={timerState.currentActiveRound}
								/>
							</div>
							<div className="item w-full flex flex-row justify-between items-center border border-foreground p-2">
								<div className="title">
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
							<div className="item w-full flex flex-row justify-between items-center border border-foreground p-2">
								<div className="title">
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
						<Button
							type={"button"}
							onClick={handleSessionCreation}
							disabled={isCreating}
							negative
							block
						>
							Create session
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
