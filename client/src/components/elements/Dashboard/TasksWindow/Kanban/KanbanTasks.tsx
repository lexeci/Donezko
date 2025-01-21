"use client";

import { DragDropContext } from "@hello-pangea/dnd";

import { TASK_COLUMNS } from "@/constants/tasks.constants";
import { useDragAndDropTasks } from "@/hooks/tasks/useDragAndDropTasks"; // Зміна назви хуку для унікальності

import { TaskResponse } from "@/types/task.types";
import { Dispatch, SetStateAction } from "react";
import { KanbanTaskColumn } from "./KanbanTaskColumn";
import styles from "./KanbanTaskView.module.scss";

export function KanbanTaskView({
	taskList,
	setTaskList,
	projectId,
	handleRefetch,
}: {
	taskList?: TaskResponse[];
	setTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
	projectId: string;
	handleRefetch: () => void;
}) {
	const { handleDragEnd } = useDragAndDropTasks(handleRefetch); // Зміна назви пропса

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
						projectId={projectId}
						updateTasks={setTaskList} // Зміна назви пропса
						handleRefetch={handleRefetch}
					/>
				))}
			</div>
		</DragDropContext>
	);
}
