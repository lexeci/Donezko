import { Metadata } from "next";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";

import {
	BlockContainerAdvice,
	BlockContainerRecent,
	BlockContainerStatics,
	BlockContainerWeather,
} from "@/components/ui/dashboard";
import { TypeTaskFormState } from "@/types/task.types";

export const metadata: Metadata = {
	title: `${SITE_NAME} - Dashboard`,
	...NO_INDEX_PAGE
}

export default function Home() {
	const dataTotalStatics = [
		{ title: "Total:", amount: 19 },
		{ title: "Completed:", amount: 13 },
		{ title: "Dropped:", amount: 3 },
		{ title: "This week:", amount: 3 },
	];

	const dataRecentTasks: TypeTaskFormState[] = [
		{
			title: "Hey complete this task",
			description: "Hey what's up? What about to finis this damn task mate?",
		},
		{
			title: "Hey complete this task",
			description: "Hey what's up? What about to finis this damn task mate?",
		},
		{
			title: "Hey complete this task",
			description: "Hey what's up? What about to finis this damn task mate?",
		},
		{
			title: "Hey complete this task",
			description: "Hey what's up? What about to finis this damn task mate?",
		},
	];

	const dataAdvice = 'Stop straggling'

	return (
		<div className="main-container">
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
			<div className="content grid grid-cols-2 grid-rows-2 gap-3">
				<BlockContainerStatics />
				<BlockContainerRecent data={dataRecentTasks} />
				<BlockContainerAdvice data={dataAdvice}/>
				<BlockContainerWeather />
			</div>
		</div>
	);
}
