import { TaskResponse } from "@/types/task.types";
import { Dispatch, SetStateAction } from "react";
import ModalWindow from "../../ModalWindow/ModalWindow";
import TaskCreate from "./Operate/TaskCreate";

interface TaskOperate {
	updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
	filterDate: string | undefined;
	onClose: () => void;
	type: "create" | "edit" | "operate";
	projectId: string;
}

export default function TaskOperate({
	type,
	filterDate,
	onClose,
	updateTaskList,
	projectId,
}: TaskOperate) {
	const returnElement = () => {
		switch (type) {
			case "create":
				return (
					<TaskCreate
						filterDate={filterDate}
						updateTaskList={updateTaskList}
						projectId={projectId}
					/>
				);

			case "edit":
				return <></>;

			case "operate":
				return <></>;

			default:
				return <></>;
		}
	};

	return (
		<ModalWindow
			title="Task manager.exe"
			subtitle="Manage your task straight away"
			onClose={onClose}
		>
			<div className="container bg-background grid grid-cols-2 grid-rows-1 p-0.5 gap-x-0.5 w-full h-full border border-foreground">
				<div className="task-info p-4 border border-foreground overflow-y-auto">
					{returnElement()}
				</div>
				<div className="add-info p-4 border border-foreground overflow-y-auto"></div>
			</div>
		</ModalWindow>
	);
}
