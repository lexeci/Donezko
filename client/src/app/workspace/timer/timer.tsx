"use client";

import {
	Loading03Icon,
	PauseIcon,
	PlayIcon,
	RefreshIcon,
} from "hugeicons-react";

import { Button } from "@/components/ui/buttons/Button";

import { timeFormatter } from "../../../utils/timeFormatter";
import { useCreateSession } from "../../../hooks/timer/useCreateSession";
import { useDeleteSession } from "../../../hooks/timer/useDeleteSession";
import { useTimer } from "../../../hooks/timer/useTimer";
import { useTimerActions } from "../../../hooks/timer/useTimerActions";
import { useTodaySession } from "../../../hooks/timer/useTodaySession";
import { TimerRounds } from "./rounds/TimerRounds";

export function Timer() {
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
		<div className="relative w-80 text-center flex flex-col justify-center items-center gap-3">
			{isLoading ? (
				<Loading03Icon />
			) : (
				<>
					<div className="text-7xl font-bold">
						{timeFormatter(timerState.secondsLeft)}
					</div>

					{sessionsResponse ? (
						<>
							<TimerRounds
								rounds={rounds}
								nextRoundHandler={actions.moveToNextRound}
								prevRoundHandler={actions.moveToPreviousRound}
								currentActiveRound={timerState.currentActiveRound}
							/>
							<button
								className="opacity-80 hover:opacity-100 transition-opacity"
								onClick={handlePlayPause}
								disabled={actions.isUpdateRoundPending}
							>
								{timerState.isRunning ? (
									<PauseIcon size={30} />
								) : (
									<PlayIcon size={30} />
								)}
							</button>
							<button
								onClick={handleSessionDeletion}
								className="absolute top-0 right-0 opacity-40 hover:opacity-90 transition-opacity"
								disabled={isDeleting}
							>
								<RefreshIcon size={19} />
							</button>
						</>
					) : (
						<Button
							onClick={handleSessionCreation}
							className="mt-1"
							disabled={isCreating}
						>
							Create session
						</Button>
					)}
				</>
			)}
		</div>
	);
}
