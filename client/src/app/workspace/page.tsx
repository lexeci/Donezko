import {
	BlockContainerAdvice,
	BlockContainerRecent,
	BlockContainerStatics,
	BlockContainerWeather,
} from "@/components/elements/dashboard";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { TaskFormData } from "@/types/task.types";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `${SITE_NAME} - Dashboard`,
	...NO_INDEX_PAGE,
};

export default function Home() {
	const recentTasks: TaskFormData[] = Array(4).fill({
		title: "Hey complete this task",
		description: "Hey what's up? What about finishing this task, mate?",
	});

	const adviceMessage = "Stop straggling";

	return (
		<div className="main-container">
			<header className="title-bar pb-3 mb-3">
				<h1 className="welcoming font-normal text-xl">
					Glad to see you again,
					<span className="capitalize font-bold">Andriy!</span>
				</h1>
				<p className="description">
					There is a dashboard panel, where everything you might need to know is
					displayed.
				</p>
			</header>
			<div className="content grid grid-cols-2 grid-rows-2 gap-3">
				<BlockContainerStatics />
				<BlockContainerRecent data={recentTasks} />
				<BlockContainerAdvice data={adviceMessage} />
				<BlockContainerWeather />
			</div>
		</div>
	);
}
