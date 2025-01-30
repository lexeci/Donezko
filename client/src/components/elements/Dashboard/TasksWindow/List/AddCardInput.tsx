import { TaskResponse } from "@/types/task.types";
import { useState, type Dispatch, type SetStateAction } from "react";
import TaskOperate from "../TaskOperate";

import pageStyles from "../TaskWindow.module.scss";
import styles from "./ListRowView.module.scss";

interface ListAddRowInput {
	filterDate?: string;
	updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
	projectId: string;
	handleRefetch: () => void;
}

export default function AddCardInput({
	updateTaskList,
	filterDate,
	projectId,
	handleRefetch,
}: ListAddRowInput) {
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

	return (
		<div className={styles.addRow}>
			<button
				onClick={() => setShowCreateModal(true)}
				className={pageStyles["add-button"]}
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
					handleRefetch={handleRefetch}
				/>
			)}
		</div>
	);
}
