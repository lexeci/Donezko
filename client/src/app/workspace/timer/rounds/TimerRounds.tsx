import cn from "clsx";
import { ArrowLeft02Icon, ArrowRight02Icon} from "hugeicons-react";
import { TimerRoundResponse } from "@/types/timer.types";

import styles from "./TimerRounds.module.scss";

interface ITimerRounds {
	rounds: TimerRoundResponse[] | undefined;
	nextRoundHandler: () => void;
	prevRoundHandler: () => void;
	activeRound: TimerRoundResponse | undefined;
}

export function TimerRounds({
	rounds,
	nextRoundHandler,
	prevRoundHandler,
	activeRound,
}: ITimerRounds) {
	const isCanPrevRound = rounds
		? rounds.some(round => round.isCompleted)
		: false;
	const isCanNextRound = rounds
		? !rounds[rounds.length - 1].isCompleted
		: false;

	return (
		<div className={styles.container}>
			<button
				className={styles.button}
				disabled={!isCanPrevRound}
				onClick={() => (isCanPrevRound ? prevRoundHandler() : false)}
			>
				<ArrowLeft02Icon size={23} />
			</button>
			<div className={styles.roundsContainer}>
				{rounds &&
					rounds.map((round, index) => (
						<div
							key={index}
							className={cn(styles.round, {
								[styles.completed]: round.isCompleted,
								[styles.active]:
									round.id === activeRound?.id && !round.isCompleted,
							})}
						/>
					))}
			</div>
			<button
				className={styles.button}
				disabled={!isCanNextRound}
				onClick={() => (isCanNextRound ? nextRoundHandler() : false)}
			>
				<ArrowRight02Icon size={23} />
			</button>
		</div>
	);
}
