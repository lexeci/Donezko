import pageStyles from "@/app/page.module.scss";
import { PageHeader, PageLayout, Timer } from "@/components/index";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `${SITE_NAME} - Pomodoro Timer`,
	...NO_INDEX_PAGE,
};

export default function Pomodoro() {
	return (
		<PageLayout>
			<PageHeader
				pageTitle="Pomodoro Timer"
				title="Stop your procrastination"
				desc="This page is dedicated for managing your focus where using a pomodoro timer methodic."
			/>
			<div className={pageStyles["workspace-content-center"]}>
				<Timer />
			</div>
		</PageLayout>
	);
}
