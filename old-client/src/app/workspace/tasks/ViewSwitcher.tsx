import cn from "clsx";
import { CheckListIcon, Layout03Icon } from "hugeicons-react";

type ViewType = "list" | "kanban"; // Зміна назви типу для унікальності

interface ViewSwitcherProps {
	currentView: ViewType; // Зміна назви пропса
	onChangeView: (view: ViewType) => void; // Зміна назви пропса
}

export function ViewSwitcher({ onChangeView, currentView }: ViewSwitcherProps) {
	// Зміна назви функції
	return (
		<div className="flex items-center gap-4 mb-5">
			<button
				className={cn("flex items-center gap-1", {
					"opacity-40": currentView === "kanban", // Зміна змінної
				})}
				onClick={() => onChangeView("list")} // Зміна логіки
			>
				<CheckListIcon />
				Task List
			</button>
			<button
				className={cn("flex items-center gap-1", {
					"opacity-40": currentView === "list", // Зміна змінної
				})}
				onClick={() => onChangeView("kanban")} // Зміна логіки
			>
				<Layout03Icon />
				Task Board
			</button>
		</div>
	);
}
