import { Draggable, Droppable } from "@hello-pangea/dnd";
import type { Dispatch, SetStateAction } from "react";

import type { TaskResponse } from "@/types/task.types";

import { DATE_FILTERS } from "@/src/constants/tasks.constants";
import { filterTasksByDate } from "@/utils/filterTasksByDate";

import { AddCardInput } from "./AddCardInput";
import { KanbanTaskCard } from "./KanbanTaskCard";
import styles from "./KanbanTaskView.module.scss";

interface KanbanTaskColumnProps {
	// Зміна назви інтерфейсу для унікальності
	value: string;
	label: string;
	items: TaskResponse[] | undefined;
	updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса
	projectId: string;
}

export function KanbanTaskColumn({
	value,
	items,
	label,
	updateTasks,
	projectId,
}: KanbanTaskColumnProps) {
	return (
		<Droppable droppableId={value}>
			{provided => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					<div className={styles.column}>
						<div className={styles.columnHeading}>{label}</div>
						<div className={styles.container}>
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
										</div>
									)}
								</Draggable>
							))}

							{provided.placeholder}

							{value !== "completed" && !items?.some(item => !item.id) && (
								<AddCardInput
									updateTaskList={updateTasks} // Зміна назви пропса
									filterDate={
										DATE_FILTERS[value]
											? DATE_FILTERS[value].format()
											: undefined
									}
									projectId={projectId}
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</Droppable>
	);
}
