import { Button } from "@/components/ui";
import { TimerRoundResponse } from "@/types/timer.types";
import cn from "clsx";

import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import styles from "./TimerRounds.module.scss";

interface TimerRounds {
  rounds: TimerRoundResponse[] | undefined; // Array of timer rounds or undefined if none
  nextRoundHandler: () => void; // Callback to go to the next round
  prevRoundHandler: () => void; // Callback to go to the previous round
  activeRound: TimerRoundResponse | undefined; // Currently active round or undefined
}

/**
 * TimerRounds component renders a horizontal rounds indicator with navigation buttons.
 * It shows completed, active, and pending rounds visually and allows navigating between them.
 *
 * @param {Object} props - Component props
 * @param {TimerRoundResponse[] | undefined} props.rounds - List of timer rounds
 * @param {() => void} props.nextRoundHandler - Function to call on next round button click
 * @param {() => void} props.prevRoundHandler - Function to call on previous round button click
 * @param {TimerRoundResponse | undefined} props.activeRound - Currently active round object
 * @returns {JSX.Element}
 */
export default function TimerRounds({
  rounds,
  nextRoundHandler,
  prevRoundHandler,
  activeRound,
}: TimerRounds) {
  // Determine if "previous round" button should be enabled: any round completed exists
  const isCanPrevRound = !!rounds && rounds.some((round) => round.isCompleted);

  // Determine if "next round" button should be enabled: any round not completed exists
  const isCanNextRound = !!rounds && rounds.some((round) => !round.isCompleted);

  return (
    <div className={styles.container}>
      {/* Button to go to previous round, disabled if no completed rounds */}
      <Button
        type="button"
        disabled={!isCanPrevRound}
        onClick={prevRoundHandler}
        modal
      >
        <CaretLeft size={16} />
      </Button>

      {/* Rounds indicator showing each round's completion and active status */}
      <div className={styles["rounds-container"]}>
        {rounds && rounds.length > 0 ? (
          rounds.map((round, index) => (
            <div
              key={index}
              className={cn(styles.round, {
                [styles.completed]: round.isCompleted, // Apply style if round completed
                // Apply style if round is active and not completed
                [styles.active]:
                  round.id === activeRound?.id && !round.isCompleted,
              })}
            />
          ))
        ) : (
          // Display message if no rounds are available
          <p>No rounds available</p>
        )}
      </div>

      {/* Button to go to next round, disabled if all rounds completed */}
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
