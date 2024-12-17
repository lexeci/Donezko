import pageStyles from "@/app/page.module.scss";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { Button, EntityItem, PageHeader, PageLayout } from "@/src/components";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Plus, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `${SITE_NAME} - Teams`,
	...NO_INDEX_PAGE,
};

export default function Teams() {
	const teamArray = [
		{
			title: "Insomnia Team",
			tasks: 128,
			participants: 12,
			id: "2331321213213",
		},
		{
			title: "Insomnia Team",
			tasks: 128,
			participants: 12,
			id: "2331321213213",
		},
		{
			title: "Insomnia Team",
			tasks: 128,
			participants: 12,
			id: "2331321213213",
		},
		{
			title: "Insomnia Works",
			tasks: 128,
			participants: 12,
			id: "2331321213213",
		},
	];

	return (
		<PageLayout>
			<PageHeader
				pageTitle="Teams"
				title="Manage your teams"
				desc="This page is dedicated for managing teams which are available for you."
			/>
			<div className={pageStyles["workspace-content-col"]}>
				<div className="counter w-full flex flex-row justify-between items-center">
					<div className="title">
						<h4>Total Teams: 4</h4>
					</div>
					<Button type="button">
						<Plus size={22} className="mr-4" /> Team
					</Button>
				</div>
				<div className={pageStyles["workspace-content-grid-3"]}>
					{teamArray.map((item, i) => (
						<EntityItem
							icon={<UsersThree size={84} />}
							linkBase={`/workspace/teams/${item.id}`}
							title={item.title}
							firstStat={`Participants: ${item.participants}`}
							secondaryStat={`Tasks: ${item.tasks}`}
							key={generateKeyComp(`${item.title}__${i}`)}
						/>
					))}
				</div>
			</div>
		</PageLayout>
	);
}
