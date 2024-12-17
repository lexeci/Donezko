import { WindowContainer } from "@/components/index";
import { KanbanTaskView } from "./Kanban/KanbanTasks";

export default function TasksWindow() {
	return (
		<WindowContainer title="Insomnia Project" subtitle="Tasks [99+]" fullPage>
			{true ? <KanbanTaskView /> : <></>}
		</WindowContainer>
	);
}
