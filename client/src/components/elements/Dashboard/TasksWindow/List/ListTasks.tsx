"use client";

import { DragDropContext } from "@hello-pangea/dnd";

import { TASK_COLUMNS } from "@/constants/tasks.constants";
import { useDragAndDropTasks } from "@/hooks/tasks/useDragAndDropTasks"; // Зміна назви хуку для унікальності

import { TaskResponse } from "@/types/task.types";
import { Dispatch, SetStateAction } from "react";
import styles from "./ListRowView.module.scss";
import { ListRowParent } from "./ListTasksRow";

interface ListTaskView {
	taskList?: TaskResponse[];
	setTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
	projectId: string;
	handleRefetch: () => void;
}

export function ListTaskView({
	taskList,
	setTaskList,
	projectId,
	handleRefetch,
}: ListTaskView) {
	const { handleDragEnd } = useDragAndDropTasks(handleRefetch); // Зміна назви пропса

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className={styles.table}>
				<div className={styles.header}>
					<div>Task name</div>
					<div>Author</div>
					<div>Priority</div>
					<div>Status</div>
					<div>Date</div>
				</div>

				<div className={styles.parentsWrapper}>
					{TASK_COLUMNS.map(column => (
						<ListRowParent
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
			</div>
		</DragDropContext>
	);
}
