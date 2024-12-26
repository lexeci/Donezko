import { PageHeader, PageLayout, TeamElements } from "@/components/index";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `${SITE_NAME} - Teams`,
	...NO_INDEX_PAGE,
};

export default function Teams() {
	return (
		<PageLayout>
			<PageHeader
				pageTitle="Teams"
				title="Manage your teams"
				desc="This page is dedicated for managing teams which are available for you."
			/>
			<TeamElements />
		</PageLayout>
	);
}
