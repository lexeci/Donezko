import type { Dispatch, SetStateAction } from "react";

import type { TimerRoundResponse } from "@/types/timer.types";

export interface TimerState {
	isRunning: boolean;
	secondsLeft: number;
	activeRound: TimerRoundResponse | undefined;

	setIsRunning: Dispatch<SetStateAction<boolean>>;
	setSecondsLeft: Dispatch<SetStateAction<number>>;
	setActiveRound: Dispatch<SetStateAction<TimerRoundResponse | undefined>>;
}
