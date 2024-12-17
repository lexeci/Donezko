import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import type { TimerState } from "../timer.types";

import { timerService } from "@/services/timer.service";
import { useLoadSettings } from "./useLoadSettings";

export function useTodaySession({
	setActiveRound,
	setSecondsLeft,
}: TimerState) {
	const { workInterval } = useLoadSettings();

	const {
		data: sessionsResponse,
		isLoading,
		refetch,
		isSuccess,
	} = useQuery({
		queryKey: ["get today session"],
		queryFn: () => timerService.getTodaySession(),
	});

	const rounds = sessionsResponse?.data.rounds;

	useEffect(() => {
		if (isSuccess && rounds) {
			const activeRound = rounds.find(round => !round.isCompleted);
			setActiveRound(activeRound);

			if (activeRound && activeRound?.totalSeconds !== 0) {
				setSecondsLeft(activeRound.totalSeconds);
			}
		}
	}, [isSuccess, rounds]);

	return { sessionsResponse, isLoading, workInterval };
}
