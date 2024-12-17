import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { PageHeader, PageLayout, ProjectElements } from "@/src/components";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `${SITE_NAME} - Projects`,
	...NO_INDEX_PAGE,
};

export default function Projects() {
	return (
		<PageLayout>
			<PageHeader
				pageTitle="Projects"
				title="Manage your projects"
				desc="This page is dedicated for managing projects which are available for you."
			/>
			<ProjectElements isAdministrate />
		</PageLayout>
	);
}
