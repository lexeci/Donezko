import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Dispatch, SetStateAction, useState } from "react";

import type { TaskResponse } from "@/types/task.types";

import { DATE_FILTERS } from "@/constants/tasks.constants";
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
	handleRefetch: () => void;
}

export function KanbanTaskColumn({
	value,
	items,
	label,
	updateTasks,
	projectId,
	handleRefetch,
}: KanbanTaskColumnProps) {
	const [disableDnD, setDisableDnD] = useState<boolean>(false);

	return (
		<Droppable droppableId={value}>
			{provided => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					<div className={styles.column}>
						<div className={styles.columnHeading}>{label}</div>
						<div className={styles.container}>
							{filterTasksByDate(items, value)?.map((item, index) => (
								<Draggable
									key={item.id}
									draggableId={item.id}
									index={index}
									isDragDisabled={disableDnD}
								>
									{provided => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<KanbanTaskCard
												key={item.id}
												data={item}
												projectId={projectId}
												updateTasks={updateTasks}
												handleRefetch={handleRefetch}
												setDisableDnD={setDisableDnD}
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
									handleRefetch={handleRefetch}
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</Droppable>
	);
}
