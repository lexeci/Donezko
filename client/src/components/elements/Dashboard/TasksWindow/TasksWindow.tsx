import { WindowContainer } from "@/components/index";
import { TaskResponse } from "@/types/task.types";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";
import { KanbanTaskView } from "./Kanban/KanbanTasks";
import { ListTaskView } from "./List/ListTasks";

import styles from "./TaskWindow.module.scss";

interface TasksWindow {
	isPage?: boolean;
	isList?: boolean;
	taskList?: TaskResponse[];
	setTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
	projectId: string;
	handleRefetch: () => void;
}

export default function TasksWindow({
	isPage,
	isList,
	taskList,
	setTaskList,
	projectId,
	handleRefetch,
}: TasksWindow) {
	return !isPage ? (
		<WindowContainer
			title="Insomnia Project"
			subtitle={`Tasks [${taskList?.length ?? 0}]`}
			fullPage
		>
			{!isList ? (
				<KanbanTaskView
					taskList={taskList}
					setTaskList={setTaskList}
					projectId={projectId}
					handleRefetch={handleRefetch}
				/>
			) : (
				<ListTaskView
					taskList={taskList}
					setTaskList={setTaskList}
					projectId={projectId}
					handleRefetch={handleRefetch}
				/>
			)}
		</WindowContainer>
	) : (
		<div className={clsx(styles["is-page"], "bg-radial-grid-small")}>
			{!isList ? (
				<KanbanTaskView
					taskList={taskList}
					setTaskList={setTaskList}
					projectId={projectId}
					handleRefetch={handleRefetch}
				/>
			) : (
				<ListTaskView
					taskList={taskList}
					setTaskList={setTaskList}
					projectId={projectId}
					handleRefetch={handleRefetch}
				/>
			)}
		</div>
	);
}
