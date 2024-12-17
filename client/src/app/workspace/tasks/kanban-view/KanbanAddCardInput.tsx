import { type Dispatch, type SetStateAction } from "react";

import type { TaskResponse } from "@/types/task.types";

interface KanbanAddCardInput {
	filterDate?: string;
	setItems: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
}

export function KanbanAddCardInput({
	setItems,
	filterDate,
}: KanbanAddCardInput) {
	const addCard = () => {
		setItems(prev => {
			if (!prev) return;

			return [
				...prev,
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
			<button onClick={addCard} className="italic opacity-40 text-sm">
				Add task...
			</button>
		</div>
	);
}
