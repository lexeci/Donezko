import { useFormContext } from "react-hook-form";

import type {
	TimeBlockFormValues,
	TimeBlockResponse,
} from "@/types/time-block.types";

import {
	DragDropVerticalIcon,
	Loading03Icon,
	PencilEdit02Icon,
	WasteIcon,
} from "hugeicons-react";
import { useDeleteBlock } from "@/hooks/timing/useDeleteBlock";
import { useTimeBlockSortable } from "@/hooks/timing/useTimeBlockSortable";
import styles from "./TimeBlocking.module.scss";

export function TimeBlock({ timingData }: { timingData: TimeBlockResponse }) {
	const { attributes, listeners, setNodeRef, sortableStyle } =
		useTimeBlockSortable(timingData.id);
	const { reset } = useFormContext<TimeBlockFormValues>();
	const { deleteBlock, isDeletePending } = useDeleteBlock(timingData.id);

	return (
		<div ref={setNodeRef} style={sortableStyle}>
			<div
				className={styles.block}
				style={{
					backgroundColor: timingData.color || "lightgray",
					height: `${timingData.duration}px`,
				}}
			>
				<div className="flex items-center">
					<button {...attributes} {...listeners} aria-describedby="time-block">
						<DragDropVerticalIcon className={styles.grip} />
					</button>
					<div>
						{timingData.title}
						<i className="text-xs opacity-50">({timingData.duration} min.)</i>
					</div>
				</div>

				<div className={styles.actions}>
					<button
						onClick={() => {
							reset({
								id: timingData.id,
								color: timingData.color,
								duration: timingData.duration,
								title: timingData.title,
								order: timingData.order,
							});
						}}
						className="opacity-50 transition-opacity hover:opacity-100 mr-2"
					>
						<PencilEdit02Icon size={16} />
					</button>
					<button
						onClick={() => deleteBlock()}
						className="opacity-50 transition-opacity hover:opacity-100"
					>
						{isDeletePending ? (
							<Loading03Icon size={16} />
						) : (
							<WasteIcon size={16} />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
