import { useState, type Dispatch, type SetStateAction } from "react";

import type { TaskResponse } from "@/types/task.types";
import TaskOperate from "../TaskOperate";

interface AddCardInputProps {
	// Зміна назви інтерфейсу для унікальності
	filterDate?: string;
	updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса для унікальності
	projectId: string;
}

export function AddCardInput({
	// Зміна назви компонента для унікальності
	updateTaskList,
	filterDate,
	projectId,
}: AddCardInputProps) {
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
	return (
		<div className="mt-5">
			<button
				onClick={() => setShowCreateModal(true)}
				className="italic text-xs border-b border-foreground opacity-70"
			>
				Add task...
			</button>
			{showCreateModal && (
				<TaskOperate
					type="create"
					updateTaskList={updateTaskList}
					filterDate={filterDate}
					onClose={() => setShowCreateModal(false)}
					projectId={projectId}
				/>
			)}
		</div>
	);
}
