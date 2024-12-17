import pageStyles from "@/app/page.module.scss";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { Button, EntityItem, PageHeader, PageLayout } from "@/src/components";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Browsers, Plus } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `${SITE_NAME} - Projects`,
	...NO_INDEX_PAGE,
};

export default function Projects() {
	const teamArray = [
		{
			title: "Insomnia Project",
			tasks: 128,
			teams: 12,
			id: "2331321213213",
		},
		{
			title: "Insomnia Project",
			tasks: 128,
			teams: 12,
			id: "2331321213213",
		},
		{
			title: "Insomnia Project",
			tasks: 128,
			teams: 12,
			id: "2331321213213",
		},
		{
			title: "Insomnia Project",
			tasks: 128,
			teams: 12,
			id: "2331321213213",
		},
	];

	return (
		<PageLayout>
			<PageHeader
				pageTitle="Projects"
				title="Manage your projects"
				desc="This page is dedicated for managing projects which are available for you."
			/>
			<div className={pageStyles["workspace-content-col"]}>
				<div className="counter w-full flex flex-row justify-between items-center">
					<div className="title">
						<h4>Total Projects: 4</h4>
					</div>
					<Button type="button">
						<Plus size={22} className="mr-4" /> Project
					</Button>
				</div>
				<div className={pageStyles["workspace-content-grid-3"]}>
					{teamArray.map((item, i) => (
						<EntityItem
							icon={<Browsers size={84} />}
							linkBase={`/workspace/projects/${item.id}`}
							title={item.title}
							firstStat={`Teams: ${item.teams}`}
							secondaryStat={`Tasks: ${item.tasks}`}
							key={generateKeyComp(`${item.title}__${i}`)}
						/>
					))}
				</div>
			</div>
		</PageLayout>
	);
}
