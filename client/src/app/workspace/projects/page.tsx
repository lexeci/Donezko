import { PageHeader, PageLayout, ProjectElements } from "@/components/index";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  // Metadata for the Projects page, including the title and SEO directives
  title: `${SITE_NAME} - Projects`,
  ...NO_INDEX_PAGE,
};

/**
 * Projects component renders the projects management page.
 *
 * It includes a page header and the ProjectElements component which
 * displays the list and controls related to projects.
 *
 * @returns {JSX.Element} The projects page layout and content
 */
export default function Projects() {
  return (
    <PageLayout>
      <PageHeader
        pageTitle="Projects"
        title="Manage your projects"
        desc="This page is dedicated for managing projects which are available for you."
      />
      <ProjectElements />
    </PageLayout>
  );
}
