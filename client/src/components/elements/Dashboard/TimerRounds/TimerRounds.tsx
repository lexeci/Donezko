import { Button } from "@/components/ui";
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
	const isCanPrevRound = !!rounds && rounds.some(round => round.isCompleted);
	const isCanNextRound = !!rounds && rounds.some(round => !round.isCompleted);

	return (
		<div className={styles.container}>
			<Button
				type="button"
				disabled={!isCanPrevRound}
				onClick={prevRoundHandler}
				modal
			>
				<CaretLeft size={16} />
			</Button>
			{/* Rounds Indicator */}
			<div className={styles["rounds-container"]}>
				{rounds && rounds.length > 0 ? (
					rounds.map((round, index) => (
						<div
							key={index}
							className={cn(styles.round, {
								[styles.completed]: round.isCompleted,
								[styles.active]:
									round.id === activeRound?.id && !round.isCompleted,
							})}
						/>
					))
				) : (
					<p>No rounds available</p>
				)}
			</div>
			<Button
				type="button"
				disabled={!isCanNextRound}
				onClick={nextRoundHandler}
				modal
			>
				<CaretRight size={16} />
			</Button>
		</div>
	);
}
