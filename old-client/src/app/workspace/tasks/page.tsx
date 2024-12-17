import type { Metadata } from "next";
import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { TaskDashboard } from "./TaskDashboard"; // Зміна назви компонента

export const metadata: Metadata = {
	title: "Task Management", // Зміна заголовка
	...NO_INDEX_PAGE,
};

export default function TaskManagementPage() { // Зміна назви функції
	return (
		<div className="container mx-auto p-4"> {/* Додаємо стилі */}
			<div className="header mb-6"> {/* Зміна елемента */}
				<h1 className="text-2xl font-semibold">
					Welcome back, <span className="font-extrabold">Andriy!</span>
				</h1>
				<p className="mt-2 text-gray-600">
					Your task dashboard is ready with all the information you need.
				</p>
			</div>
			<TaskDashboard /> {/* Зміна назви компонента */}
		</div>
	);
}
