import type { TimerRoundResponse } from "@/types/timer.types";
import { useEffect, useState } from "react";
import type { TimerState } from "@/types/timer.types";
import { useLoadSettings } from "./useLoadSettings";

export function useTimer(): TimerState {
	const { breakInterval, workInterval } = useLoadSettings();

	const [isRunning, setIsRunning] = useState(false);
	const [isBreakTime, setIsBreakTime] = useState(false);
	const [secondsLeft, setSecondsLeft] = useState(workInterval * 60);
	const [currentActiveRound, setActiveRound] = useState<TimerRoundResponse>();

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;

		if (isRunning) {
			timer = setInterval(() => {
				setSecondsLeft(prev => prev - 1);
			}, 1000);
		} else if (!isRunning && secondsLeft !== 0 && timer) {
			clearInterval(timer);
		}

		// Cleanup function to clear the timer on component unmount
		return () => {
			if (timer) clearInterval(timer);
		};
	}, [isRunning, secondsLeft]);

	useEffect(() => {
		if (secondsLeft > 0) return; // Exit early if time remains

		// Toggle between work and break intervals
		setIsBreakTime(prev => !prev);
		setSecondsLeft((isBreakTime ? workInterval : breakInterval) * 60);
	}, [secondsLeft, isBreakTime, workInterval, breakInterval]);

	return {
		currentActiveRound,
		secondsLeft,
		setActiveRound,
		setIsRunning,
		setSecondsLeft,
		isRunning,
	};
}
