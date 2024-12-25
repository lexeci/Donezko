import { type Dispatch, type SetStateAction } from "react";

import type { TaskResponse } from "@/types/task.types";

interface AddCardInputProps {
	// Зміна назви інтерфейсу для унікальності
	filterDate?: string;
	updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса для унікальності
}

export function AddCardInput({
	// Зміна назви компонента для унікальності
	updateTaskList,
	filterDate,
}: AddCardInputProps) {
	const handleAddCard = () => {
		// Зміна назви функції для унікальності
		updateTaskList(previousTasks => {
			// Зміна назви пропса в функції
			if (!previousTasks) return;

			return [
				...previousTasks,
				{
					id: "",
					title: "",
					isCompleted: false,
					createdAt: filterDate,
					description: "",
				},
			];
		});
	};

	return (
		<div className="mt-5">
			<button
				onClick={handleAddCard}
				className="italic text-xs border-b border-foreground opacity-70"
			>
				Add task...
			</button>
		</div>
	);
}
