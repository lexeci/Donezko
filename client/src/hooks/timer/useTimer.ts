import { useEffect, useState } from "react";

import type { TimerRoundResponse } from "@/types/timer.types";

import type { TimerState } from "@/types/timer.types";

import { useLoadSettings } from "./useLoadSettings";

export function useTimer(): TimerState {
	const { breakInterval, workInterval, isDataLoaded } = useLoadSettings();

	const [isRunning, setIsRunning] = useState(false);
	const [isBreakTime, setIsBreakTime] = useState(false);

	const [secondsLeft, setSecondsLeft] = useState(workInterval * 60);
	const [activeRound, setActiveRound] = useState<TimerRoundResponse>();

	useEffect(() => {
		setSecondsLeft(workInterval * 60);
	}, [workInterval]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isRunning) {
			interval = setInterval(() => {
				setSecondsLeft(secondsLeft => secondsLeft - 1);
			}, 1000);
		} else if (!isRunning && secondsLeft !== 0 && interval) {
			clearInterval(interval);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isRunning, secondsLeft, workInterval, activeRound]);

	useEffect(() => {
		// Ранний выход, если время не истекло
		if (secondsLeft > 0) return;

		// Переключение режима и установка нового времени одной операцией
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
