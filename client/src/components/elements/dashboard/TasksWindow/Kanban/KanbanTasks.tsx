"use client";

import { DragDropContext } from "@hello-pangea/dnd";

import { useDragAndDropTasks } from "@/hooks/tasks/useDragAndDropTasks"; // Зміна назви хуку для унікальності
import { useFetchTasks } from "@/hooks/tasks/useFetchTasks"; // Зміна назви хуку для унікальності
import { TASK_COLUMNS } from "@/src/constants/tasks.constants";

import { KanbanTaskColumn } from "./KanbanTaskColumn";
import styles from "./KanbanTaskView.module.scss";

export function KanbanTaskView() {
	const { taskList, setTaskList } = useFetchTasks(); // Зміна назви пропса
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
