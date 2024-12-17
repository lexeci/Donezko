import { TimerRoundResponse } from "@/types/timer.types";
import cn from "clsx";

import { Button } from "@/src/components/ui";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import styles from "./TimerRounds.module.scss";

interface TimerRounds {
	rounds: TimerRoundResponse[] | undefined;
	nextRoundHandler: () => void;
	prevRoundHandler: () => void;
	currentActiveRound: TimerRoundResponse | undefined;
}

export default function TimerRounds({
	rounds,
	nextRoundHandler,
	prevRoundHandler,
	currentActiveRound,
}: TimerRounds) {
	// Determine if previous and next rounds can be navigated
	const canNavigateToPrevRound = rounds
		? rounds.some(round => round.isCompleted)
		: false;
	const canNavigateToNextRound = rounds
		? !rounds[rounds.length - 1].isCompleted
		: false;

	return (
		<div className={styles.container}>
			{/* Previous Round Button */}
			<Button
				type="button"
				disabled={!canNavigateToPrevRound}
				onClick={canNavigateToPrevRound ? prevRoundHandler : undefined}
				modal
			>
				<CaretLeft size={16} />
			</Button>

			{/* Rounds Indicator */}
			<div className={styles["rounds-container"]}>
				{rounds?.map((round, index) => (
					<div
						key={index}
						className={cn(styles.round, {
							[styles.completed]: round.isCompleted,
							[styles.active]:
								round.id === currentActiveRound?.id && !round.isCompleted,
						})}
					/>
				))}
			</div>

			{/* Next Round Button */}
			<Button
				type="button"
				disabled={!canNavigateToNextRound}
				onClick={canNavigateToNextRound ? nextRoundHandler : undefined}
				modal
			>
				<CaretRight size={16} />
			</Button>
		</div>
	);
}
