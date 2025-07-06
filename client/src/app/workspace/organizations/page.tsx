import {
  OrganizationElements,
  PageHeader,
  PageLayout,
} from "@/components/index";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  // Metadata for Organizations page with no-index to prevent SEO indexing
  title: `${SITE_NAME} - Organizations`,
  ...NO_INDEX_PAGE,
};

/**
 * Organizations page component renders the organizations management interface.
 *
 * It includes a page header with titles and description, and the OrganizationElements component.
 *
 * @returns {JSX.Element} The organizations management page content
 */
export default function Organizations() {
  return (
    <PageLayout>
      <PageHeader
        pageTitle="Organizations"
        title="Manage your organizations"
        desc="This page is dedicated for managing organizations which are available for you."
      />
      {/* Render the list and controls for managing organizations */}
      <OrganizationElements />
    </PageLayout>
  );
}
