"use client";

import { DragDropContext } from "@hello-pangea/dnd";

import { TASK_COLUMNS } from "../../columns.data";
import { useDragAndDropTasks } from "@/hooks/tasks/useDragAndDropTasks"; // Зміна назви хуку для унікальності
import { useFetchTasks } from "@/hooks/tasks/useFetchTasks"; // Зміна назви хуку для унікальності

import styles from "./KanbanListView.module.scss";
import { KanbanTaskColumn } from "./KanbanTaskColumn";

export function KanbanListView() {
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
