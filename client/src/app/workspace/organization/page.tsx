import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { OrganizationElements, PageHeader, PageLayout } from "@/src/components";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `${SITE_NAME} - Organizations`,
	...NO_INDEX_PAGE,
};

export default function Organizations() {
	return (
		<PageLayout>
			<PageHeader
				pageTitle="Organizations"
				title="Manage your organizations"
				desc="This page is dedicated for managing organizations which are available for you."
			/>
			<OrganizationElements />
		</PageLayout>
	);
}
