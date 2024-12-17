"use client";

import {
	Loading03Icon,
	PauseIcon,
	PlayIcon,
	RefreshIcon,
} from "hugeicons-react";

import { Button } from "@/components/ui/buttons/Button";

import { formatTime } from "./format-time";
import { useCreateSession } from "./hooks/useCreateSession";
import { useDeleteSession } from "./hooks/useDeleteSession";
import { useTimer } from "./hooks/useTimer";
import { useTimerActions } from "./hooks/useTimerActions";
import { useTodaySession } from "./hooks/useTodaySession";
import { TimerRounds } from "./rounds/TimerRounds";

export function Timer() {
	const timerState = useTimer();
	const { isLoading, sessionsResponse, workInterval } =
		useTodaySession(timerState);

	const rounds = sessionsResponse?.data.rounds;
	const actions = useTimerActions({ ...timerState, rounds });

	const { isPending, mutate } = useCreateSession();
	const { deleteSession, isDeletePending } = useDeleteSession(() =>
		timerState.setSecondsLeft(workInterval * 60)
	);

	return (
		<div className="relative w-80 text-center flex flex-col justify-center items-center gap-3">
			{!isLoading && (
				<div className="text-7xl font-bold">
					{formatTime(timerState.secondsLeft)}
				</div>
			)}
			{isLoading ? (
				<Loading03Icon />
			) : sessionsResponse?.data ? (
				<>
					<TimerRounds
						rounds={rounds}
						nextRoundHandler={actions.nextRoundHandler}
						prevRoundHandler={actions.prevRoundHandler}
						activeRound={timerState.activeRound}
					/>
					<button
						className="opacity-80 hover:opacity-100 transition-opacity"
						onClick={
							timerState.isRunning ? actions.pauseHandler : actions.playHandler
						}
						disabled={actions.isUpdateRoundPending}
					>
						{timerState.isRunning ? (
							<PauseIcon size={30} />
						) : (
							<PlayIcon size={30} />
						)}
					</button>
					<button
						onClick={() => {
							timerState.setIsRunning(false);
							deleteSession(sessionsResponse.data.id);
						}}
						className="absolute top-0 right-0 opacity-40 hover:opacity-90 transition-opacity"
						disabled={isDeletePending}
					>
						<RefreshIcon size={19} />
					</button>
				</>
			) : (
				<Button onClick={() => mutate()} className="mt-1" disabled={isPending}>
					Create session
				</Button>
			)}
		</div>
	);
}
