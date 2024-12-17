import { Button } from "@/src/components/ui";
import { TimerRoundResponse } from "@/types/timer.types";
import cn from "clsx";

import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import styles from "./TimerRounds.module.scss";

interface TimerRounds {
	rounds: TimerRoundResponse[] | undefined;
	nextRoundHandler: () => void;
	prevRoundHandler: () => void;
	activeRound: TimerRoundResponse | undefined;
}

export default function TimerRounds({
	rounds,
	nextRoundHandler,
	prevRoundHandler,
	activeRound,
}: TimerRounds) {
	console.log(rounds);
	const isCanPrevRound = rounds
		? rounds.some(round => round.isCompleted)
		: false;
	const isCanNextRound = rounds
		? !rounds[rounds.length - 1].isCompleted
		: false;

	return (
		<div className={styles.container}>
			<Button
				type="button"
				disabled={!isCanPrevRound}
				onClick={isCanPrevRound ? prevRoundHandler : undefined}
				modal
			>
				<CaretLeft size={16} />
			</Button>
			{/* Rounds Indicator */}
			<div className={styles["rounds-container"]}>
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
			<Button
				type="button"
				disabled={!isCanNextRound}
				onClick={isCanNextRound ? nextRoundHandler : undefined}
				modal
			>
				<CaretRight size={16} />
			</Button>
		</div>
	);
}
