import { type Dispatch, type SetStateAction } from "react";

import { TaskResponse } from "@/types/task.types";

import styles from "./ListView.module.scss";

interface ListAddRowInput {
	filterDate?: string;
	setItems: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
}

export function ListAddRowInput({ setItems, filterDate }: ListAddRowInput) {
	const addRow = () => {
		setItems(prev => {
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
			<button onClick={addRow} className="italic opacity-40 text-sm">
				Add task...
			</button>
		</div>
	);
}
