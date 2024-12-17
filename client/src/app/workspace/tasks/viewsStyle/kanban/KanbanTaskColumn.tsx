import { Draggable, Droppable } from "@hello-pangea/dnd";
import type { Dispatch, SetStateAction } from "react";

import type { TaskResponse } from "@/types/task.types";

import { filterTasksByDate } from "../../../../../utils/filterTasksByDate";
import { DATE_FILTERS } from "../../columns.data";

import { AddCardInput } from "./AddCardInput";
import { KanbanTaskCard } from "./KanbanTaskCard"; // Зміна назви імпорту
import styles from "./KanbanTaskView.module.scss";

interface KanbanTaskColumnProps {
	// Зміна назви інтерфейсу для унікальності
	value: string;
	label: string;
	items: TaskResponse[] | undefined;
	updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса
}

export function KanbanTaskColumn({
	value,
	items,
	label,
	updateTasks,
}: KanbanTaskColumnProps) {
	// Зміна назви компонента для унікальності
	return (
		<Droppable droppableId={value}>
			{provided => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					<div className={styles.column}>
						<div className={styles.columnHeading}>{label}</div>

						{filterTasksByDate(items, value)?.map((item, index) => (
							<Draggable key={item.id} draggableId={item.id} index={index}>
								{provided => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
									>
										<KanbanTaskCard
											key={item.id}
											item={item}
											updateTasks={updateTasks}
										/>
										{/* Зміна назви пропса */}
									</div>
								)}
							</Draggable>
						))}

						{provided.placeholder}

						{value !== "completed" && !items?.some(item => !item.id) && (
							<AddCardInput
								updateTaskList={updateTasks} // Зміна назви пропса
								filterDate={
									DATE_FILTERS[value] ? DATE_FILTERS[value].format() : undefined
								}
							/>
						)}
					</div>
				</div>
			)}
		</Droppable>
	);
}
