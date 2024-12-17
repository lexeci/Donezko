import type { TimerRoundResponse } from "@/types/timer.types";
import type { TimerState } from "@/types/timer.types";
import { useLoadSettings } from "./useLoadSettings";
import { useUpdateRound } from "./useUpdateRound";

type UseTimerActionsProps = TimerState & {
	rounds: TimerRoundResponse[] | undefined;
};

export function useTimerActions({
	currentActiveRound,
	setIsRunning,
	secondsLeft,
	rounds,
	setActiveRound,
}: UseTimerActionsProps) {
	const { workInterval } = useLoadSettings();
	const { isUpdateRoundPending, updateRound } = useUpdateRound();

	const pauseTimer = () => {
		setIsRunning(false);
		if (!currentActiveRound?.id) return;

		updateRound({
			id: currentActiveRound.id,
			data: {
				totalSeconds: secondsLeft,
				isCompleted: Math.floor(secondsLeft / 60) >= workInterval,
			},
		});
	};

	const startTimer = () => {
		setIsRunning(true);
	};

	const moveToNextRound = () => {
		if (!currentActiveRound?.id) return;

		updateRound({
			id: currentActiveRound.id,
			data: {
				isCompleted: true,
				totalSeconds: workInterval * 60,
			},
		});
	};

	const moveToPreviousRound = () => {
		const lastCompleted = rounds?.find(round => round.isCompleted);
		if (!lastCompleted?.id) return;

		updateRound({
			id: lastCompleted.id,
			data: {
				isCompleted: false,
				totalSeconds: 0,
			},
		});

		setActiveRound(lastCompleted);
	};

	return {
		isUpdateRoundPending,
		pauseTimer,
		startTimer,
		moveToNextRound,
		moveToPreviousRound,
	};
}
