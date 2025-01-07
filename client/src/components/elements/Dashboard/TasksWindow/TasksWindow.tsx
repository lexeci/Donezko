import { WindowContainer } from "@/components/index";
import { TaskResponse } from "@/types/task.types";
import { Dispatch, SetStateAction } from "react";
import { KanbanTaskView } from "./Kanban/KanbanTasks";

interface TasksWindow {
	isPage?: boolean;
	taskList?: TaskResponse[];
	setTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
	projectId: string;
}

export default function TasksWindow({
	isPage,
	taskList,
	setTaskList,
	projectId,
}: TasksWindow) {
	return !isPage ? (
		<WindowContainer title="Insomnia Project" subtitle="Tasks [99+]" fullPage>
			{true ? (
				<KanbanTaskView
					taskList={taskList}
					setTaskList={setTaskList}
					projectId={projectId}
				/>
			) : (
				<></>
			)}
		</WindowContainer>
	) : (
		<div className="bg-radial-grid-small p-4 flex justify-start items-start flex-row overflow-x-auto w-full min-h-[90vh] border-t border-t-foreground">
			{true ? (
				<KanbanTaskView
					taskList={taskList}
					setTaskList={setTaskList}
					projectId={projectId}
				/>
			) : (
				<></>
			)}
		</div>
	);
}
