import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/constants/seo.constants";

import { TasksView } from "./TasksView";

export const metadata: Metadata = {
	title: "Tasks",
	...NO_INDEX_PAGE,
};

export default function TasksPage() {
	return (
		<div className="main-container w-full">
			<div className="title-bar pb-3 mb-3">
				<div className="welcoming font-normal text-xl">
					<h1>
						Glad to see you again,{" "}
						<span className="capitalize font-bold">Andriy!</span>
					</h1>
				</div>
				<div className="description">
					<p>
						There is a dashboard panel, where displayed everything that you
						might need to know
					</p>
				</div>
			</div>
			<TasksView />
		</div>
	);
}
