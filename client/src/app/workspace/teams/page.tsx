import { PageHeader, PageLayout, TeamElements } from "@/components/index";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { Metadata } from "next";

/**
 * Metadata for the Teams page.
 * Sets dynamic title using SITE_NAME and prevents indexing by search engines.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: `${SITE_NAME} - Teams`,
  ...NO_INDEX_PAGE,
};

/**
 * Teams component renders the team management interface.
 * Displays a header and the list of team elements for user interaction.
 *
 * @returns {JSX.Element} - Rendered teams management page
 */
export default function Teams() {
  return (
    <PageLayout>
      {/* Page header with title and description */}
      <PageHeader
        pageTitle="Teams"
        title="Manage your teams"
        desc="This page is dedicated for managing teams which are available for you."
      />

      {/* Team management section */}
      <TeamElements />
    </PageLayout>
  );
}
