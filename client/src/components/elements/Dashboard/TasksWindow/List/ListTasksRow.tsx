import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Dispatch, SetStateAction, useState } from "react";

import type { TaskResponse } from "@/types/task.types";

import { DATE_FILTERS } from "@/constants/tasks.constants";
import { filterTasksByDate } from "@/utils/filterTasksByDate";

import AddCardInput from "./AddCardInput";
import ListRowCard from "./ListRowCard";
import styles from "./ListRowView.module.scss";

interface IListRowParent {
	// Зміна назви інтерфейсу для унікальності
	value: string;
	label: string;
	items: TaskResponse[] | undefined;
	updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса
	projectId: string;
	handleRefetch: () => void;
}

export function ListRowParent({
	value,
	items,
	label,
	updateTasks,
	projectId,
	handleRefetch,
}: IListRowParent) {
	const [disableDnD, setDisableDnD] = useState<boolean>(false);

	return (
		<Droppable droppableId={value}>
			{provided => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					<div className={styles.colHeading}>
						<div className="w-full">{label}</div>
					</div>

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
									<ListRowCard
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
								DATE_FILTERS[value] ? DATE_FILTERS[value].format() : undefined
							}
							projectId={projectId}
							handleRefetch={handleRefetch}
						/>
					)}
				</div>
			)}
		</Droppable>
	);
}
