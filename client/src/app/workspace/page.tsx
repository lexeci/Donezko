import pageStyles from "@/app/page.module.scss";
import {
	DailyBoardAdvice,
	PageHeader,
	PageLayout,
	ProjectBoardStatistic,
	TasksBoardStatistic,
	TeamBoardStatistic,
} from "@/components/index";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `${SITE_NAME} - Dashboard`,
	...NO_INDEX_PAGE,
};

export default function Home() {
	return (
		<PageLayout>
			<PageHeader
				pageTitle="Dashboard"
				title="Welcome back to TPlanner"
				desc="This page is the start of our workspace. Here, you can find the main data."
			/>
			<div className={pageStyles["workspace-content-grid-2"]}>
				<TasksBoardStatistic />
				<TeamBoardStatistic />
				<DailyBoardAdvice />
				<ProjectBoardStatistic />
			</div>
		</PageLayout>
	);
}
