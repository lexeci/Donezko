import type { TimerRoundResponse, TimerState } from "@/types/timer.types";
import { useLoadSettings } from "./useLoadSettings";
import { useUpdateRound } from "./useUpdateRound";

type UseTimerActionsProps = TimerState & {
	rounds: TimerRoundResponse[] | undefined;
};

export function useTimerActions({
	activeRound,
	setIsRunning,
	secondsLeft,
	rounds,
	setActiveRound,
}: UseTimerActionsProps) {
	const { workInterval } = useLoadSettings();
	const { isUpdateRoundPending, updateRound } = useUpdateRound();

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

	const startTimer = () => {
		setIsRunning(true);
	};

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

	const moveToPreviousRound = () => {
		// Перевіряємо, чи є раунди
		if (!rounds || rounds.length === 0) return;

		// Знайти індекс останнього завершеного раунду
		const lastCompletedIndex = rounds
			.map(round => round.isCompleted)
			.lastIndexOf(true);

		// Якщо не знайдено завершених раундів, виходимо
		if (lastCompletedIndex === -1) return;

		// Отримуємо останній завершений раунд
		const lastCompletedRound = rounds[lastCompletedIndex];

		// Змінюємо стан цього раунду
		updateRound(
			{
				id: lastCompletedRound.id,
				data: {
					isCompleted: false, // Робимо раунд незавершеним
					totalSeconds: 0, // Скидаємо час
				},
			},
			{
				onSuccess: () => {
					// Встановлюємо його активним після оновлення
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
