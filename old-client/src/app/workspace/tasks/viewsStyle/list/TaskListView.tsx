"use client";

import { DragDropContext } from "@hello-pangea/dnd";

import { useDragAndDropTasks } from "@/hooks/tasks/useDragAndDropTasks"; // Зміна назви імпорту
import { useFetchTasks } from "@/hooks/tasks/useFetchTasks"; // Зміна назви імпорту
import { TASK_COLUMNS } from "../../columns.data";

import { TaskListColumn } from "./TaskListColumn"; // Зміна назви імпорту
import styles from "./TaskListView.module.scss";

export function TaskListView() {
	// Зміна назви функції
	const { taskList, setTaskList } = useFetchTasks(); // Зміна назви функції
	const { handleDragEnd } = useDragAndDropTasks(); // Зміна назви функції

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			{/* Зміна атрибута */}
			<div className={styles.table}>
				<div className={styles.header}>
					<div>Task Name</div>
					<div>Due Date</div>
					<div>Priority</div>
					<div></div>
				</div>

				<div className={styles.parentsWrapper}>
					{TASK_COLUMNS.map(column => (
						// TODO: Change all keys in project by using utils function for it
						<TaskListColumn
							key={column.value} // Зміна порядку
							tasks={taskList}
							label={column.label}
							value={column.value}
							setTasks={setTaskList}
						/>
					))}
				</div>
			</div>
		</DragDropContext>
	);
}
