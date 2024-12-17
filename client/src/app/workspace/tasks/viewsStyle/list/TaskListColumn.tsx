import { Draggable, Droppable } from "@hello-pangea/dnd";
import type { Dispatch, SetStateAction } from "react";

import type { TaskResponse } from "@/types/task.types";

import { filterTasksByDate } from "@/utils/filterTasksByDate";
import { DATE_FILTERS } from "../../columns.data";

import { ListAddTaskInput } from "./TaskListAddInput"; // Зміна назви імпорту
import { TaskListItem } from "./TaskListItem"; // Зміна назви імпорту
import styles from "./TaskListView.module.scss";

interface TaskListColumnProps {
	// Зміна назви інтерфейсу
	value: string;
	label: string;
	tasks: TaskResponse[] | undefined; // Зміна назви пропса
	setTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса
}

export function TaskListColumn({
	value,
	tasks,
	label,
	setTasks,
}: TaskListColumnProps) {
	// Зміна назви функxції
	return (
		<Droppable droppableId={value}>
			{provided => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					<div className={styles.colHeading}>
						<div className="w-full">{label}</div>
					</div>

					{filterTasksByDate(tasks, value)?.map(
						(
							item,
							index // Зміна назви змінної
						) => (
							<Draggable key={item.id} draggableId={item.id} index={index}>
								{provided => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
									>
										<TaskListItem
											key={item.id}
											item={item}
											updateTasks={setTasks}
										/>
										{/* Зміна назви пропса */}
									</div>
								)}
							</Draggable>
						)
					)}

					{provided.placeholder}

					{value !== "completed" &&
						!tasks?.some(item => !item.id) && ( // Зміна назви змінної
							<ListAddTaskInput
								updateTasks={setTasks} // Зміна назви пропса
								filterDate={
									DATE_FILTERS[value] ? DATE_FILTERS[value].format() : undefined
								}
							/>
						)}
				</div>
			)}
		</Droppable>
	);
}
