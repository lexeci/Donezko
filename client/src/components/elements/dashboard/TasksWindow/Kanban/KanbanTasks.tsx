"use client";

import { DragDropContext } from "@hello-pangea/dnd";

import { useDragAndDropTasks } from "@/hooks/tasks/useDragAndDropTasks"; // Зміна назви хуку для унікальності
import { TASK_COLUMNS } from "@/src/constants/tasks.constants";

import { TaskResponse } from "@/src/types/task.types";
import { Dispatch, SetStateAction } from "react";
import { KanbanTaskColumn } from "./KanbanTaskColumn";
import styles from "./KanbanTaskView.module.scss";

export function KanbanTaskView({
	taskList,
	setTaskList,
}: {
	taskList?: TaskResponse[];
	setTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
}) {
	const { handleDragEnd } = useDragAndDropTasks(); // Зміна назви пропса

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			{/* Виправлення на onDragEnd */}
			<div className={styles.board}>
				{TASK_COLUMNS.map(column => (
					<KanbanTaskColumn
						key={column.value}
						value={column.value}
						label={column.label}
						items={taskList}
						updateTasks={setTaskList} // Зміна назви пропса
					/>
				))}
			</div>
		</DragDropContext>
	);
}
