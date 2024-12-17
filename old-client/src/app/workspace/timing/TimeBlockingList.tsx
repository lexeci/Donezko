import Loader from "@/components/ui/Loader";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTimeBlockDnd } from "../../../hooks/timing/useTimeBlockDnd";
import { useTimeBlocks } from "../../../hooks/timing/useTimeBlocks";
import { calculateRemainingHours } from "../../../utils/calculateRemainingHours";
import { TimeBlock } from "./TimeBlock";
import styles from "./TimeBlocking.module.scss";

export function TimeBlockingList() {
	const { timeBlocks, setTimeBlocks, isLoading } = useTimeBlocks();
	const { handleDragEnd, sensors } = useTimeBlockDnd(timeBlocks, setTimeBlocks);

	if (isLoading) return <Loader />;

	const { hoursLeft } = calculateRemainingHours(timeBlocks || []); // Default to empty array if undefined

	return (
		<div>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd} // Ensure function name matches
			>
				<div className={styles.list}>
					<SortableContext
						items={timeBlocks || []}
						strategy={verticalListSortingStrategy}
					>
						{timeBlocks?.length ? (
							timeBlocks.map(item => <TimeBlock key={item.id} timingData={item} />)
						) : (
							<div>Add the first time-block on the right form</div>
						)}
					</SortableContext>
				</div>
			</DndContext>
			<div>
				{hoursLeft > 0
					? `${hoursLeft} hours out of 24 left for sleep`
					: "No hours left for sleep"}
			</div>
		</div>
	);
}
