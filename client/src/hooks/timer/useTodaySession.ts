import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { timerService } from "@/services/timer.service";
import type { TimerState } from "@/types/timer.types";
import { useLoadSettings } from "./useLoadSettings";

export function useTodaySession({
	setActiveRound,
	setSecondsLeft,
}: TimerState) {
	const { workInterval } = useLoadSettings();

	const {
		data: sessionsResponse,
		isLoading,
		isSuccess,
	} = useQuery({
		queryKey: ["get today session"],
		queryFn: () => timerService.getTodaySession(),
	});

	const rounds = sessionsResponse?.rounds;

	useEffect(() => {
		if (isSuccess && rounds) {
			const currentActiveRound = rounds.find(round => !round.isCompleted);
			setActiveRound(currentActiveRound);

			if (currentActiveRound?.totalSeconds) {
				setSecondsLeft(currentActiveRound.totalSeconds);
			}
		}
	}, [isSuccess, rounds, setActiveRound, setSecondsLeft]);

	return { sessionsResponse, isLoading, workInterval };
}
