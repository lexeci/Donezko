import { Draggable, Droppable } from "@hello-pangea/dnd";
import type { Dispatch, SetStateAction } from "react";

import type { TaskResponse } from "@/types/task.types";

import { FILTERS } from "../columns.data";
import { filterTasks } from "../filter-tasks";

import { ListAddRowInput } from "./ListAddRowInput";
import { ListRow } from "./ListRow";
import styles from "./ListView.module.scss";

interface ListRowParent {
	value: string;
	label: string;
	items: TaskResponse[] | undefined;
	setItems: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
}

export function ListRowParent({
	value,
	items,
	label,
	setItems,
}: ListRowParent) {
	return (
		<Droppable droppableId={value}>
			{provided => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					<div className={styles.colHeading}>
						<div className="w-full">{label}</div>
					</div>

					{filterTasks(items, value)?.map((item, index) => (
						<Draggable key={item.id} draggableId={item.id} index={index}>
							{provided => (
								<div
									ref={provided.innerRef}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
								>
									<ListRow key={item.id} item={item} setItems={setItems} />
								</div>
							)}
						</Draggable>
					))}

					{provided.placeholder}

					{value !== "completed" && !items?.some(item => !item.id) && (
						<ListAddRowInput
							setItems={setItems}
							filterDate={FILTERS[value] ? FILTERS[value].format() : undefined}
						/>
					)}
				</div>
			)}
		</Droppable>
	);
}
