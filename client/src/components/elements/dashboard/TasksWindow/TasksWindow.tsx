import { WindowContainer } from "@/components/index";
import { TaskResponse } from "@/src/types/task.types";
import { Dispatch, SetStateAction } from "react";
import { KanbanTaskView } from "./Kanban/KanbanTasks";

interface TasksWindow {
	isPage?: boolean;
	taskList?: TaskResponse[];
	setTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
}

export default function TasksWindow({
	isPage,
	taskList,
	setTaskList,
}: TasksWindow) {
	return !isPage ? (
		<WindowContainer title="Insomnia Project" subtitle="Tasks [99+]" fullPage>
			{true ? (
				<KanbanTaskView taskList={taskList} setTaskList={setTaskList} />
			) : (
				<></>
			)}
		</WindowContainer>
	) : (
		<div className="bg-radial-grid-small p-4 flex justify-start items-start flex-row overflow-x-auto w-full h-full border-t border-t-foreground">
			{true ? (
				<KanbanTaskView taskList={taskList} setTaskList={setTaskList} />
			) : (
				<></>
			)}
		</div>
	);
}
