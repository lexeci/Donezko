import { type Dispatch, type SetStateAction } from "react";

import { TaskResponse } from "@/types/task.types";

import styles from "./TaskListView.module.scss";

interface ListAddTaskInputProps {
	// Зміна назви інтерфейсу
	filterDate?: string;
	updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса
}

export function ListAddTaskInput({
	updateTasks,
	filterDate,
}: ListAddTaskInputProps) {
	// Зміна назви пропса
	const handleAddRow = () => {
		// Зміна назви функції
		updateTasks(prev => {
			// Зміна назви пропса
			if (!prev) return;

			return [
				...prev,
				{
					id: "",
					title: "",
					description: "",
					isCompleted: false,
					createdAt: filterDate,
				},
			];
		});
	};

	return (
		<div className={styles.addRow}>
			<button onClick={handleAddRow} className="italic opacity-40 text-sm">
				{/* Зміна назви функції */}
				Add task...
			</button>
		</div>
	);
}
