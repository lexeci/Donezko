import Loader from "@/components/ui/Loader";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { ViewSwitcher } from "./ViewSwitcher";
import { KanbanTaskView } from "./viewsStyle/kanban/KanbanTaskView";
import { TaskListView } from "./viewsStyle/list/TaskListView";

export type TypeView = "list" | "kanban";

export function TaskDashboard() {
	const [type, setType, isLoading] = useLocalStorage<TypeView>({
		key: "view-type",
		defaultValue: "list",
	});

	if (isLoading) return <Loader />;

	return (
		<div className="content w-full">
			<ViewSwitcher onChangeView={setType} currentView={type} />
			{type === "list" ? <TaskListView /> : <KanbanTaskView />}
		</div>
	);
}
