import { TimerRoundResponse } from "@/types/timer.types";
import cn from "clsx";

import { ArrowLeft02Icon, ArrowRight02Icon } from "hugeicons-react";

import styles from "./TimerRounds.module.scss";

interface TimerRounds {
	rounds: TimerRoundResponse[] | undefined;
	nextRoundHandler: () => void;
	prevRoundHandler: () => void;
	currentActiveRound: TimerRoundResponse | undefined;
}

export function TimerRounds({
	rounds,
	nextRoundHandler,
	prevRoundHandler,
	currentActiveRound,
}: TimerRounds) {
	// Determine if previous and next rounds can be navigated
	const canNavigateToPrevRound = rounds ? rounds.some(round => round.isCompleted) : false;
	const canNavigateToNextRound = rounds ? !rounds[rounds.length - 1].isCompleted : false;

	return (
		<div className={styles.container}>
			{/* Previous Round Button */}
			<button
				className={styles.button}
				disabled={!canNavigateToPrevRound}
				onClick={canNavigateToPrevRound ? prevRoundHandler : undefined}
			>
				<ArrowLeft02Icon size={23} />
			</button>
			
			{/* Rounds Indicator */}
			<div className={styles.roundsContainer}>
				{rounds?.map((round, index) => (
					<div
						key={index}
						className={cn(styles.round, {
							[styles.completed]: round.isCompleted,
							[styles.active]: round.id === currentActiveRound?.id && !round.isCompleted,
						})}
					/>
				))}
			</div>

			{/* Next Round Button */}
			<button
				className={styles.button}
				disabled={!canNavigateToNextRound}
				onClick={canNavigateToNextRound ? nextRoundHandler : undefined}
			>
				<ArrowRight02Icon size={23} />
			</button>
		</div>
	);
}
