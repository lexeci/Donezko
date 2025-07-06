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

/**
 * Metadata for the Dashboard (home) page.
 * Sets the page title dynamically using SITE_NAME and disables indexing.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: `${SITE_NAME} - Dashboard`,
  ...NO_INDEX_PAGE,
};

/**
 * Home component renders the main dashboard page.
 * It includes a header and a 2-column grid with key workspace statistics and advice.
 *
 * @returns {JSX.Element} - The rendered dashboard page
 */
export default function Home() {
  return (
    <PageLayout>
      {/* Page header with title and description */}
      <PageHeader
        pageTitle="Dashboard"
        title="Welcome back to TPlanner"
        desc="This page is the start of our workspace. Here, you can find the main data."
      />

      {/* Dashboard content area displayed in a 2-column grid */}
      <div className={pageStyles["workspace-content-grid-2"]}>
        {/* Task-related statistics widget */}
        <TasksBoardStatistic />

        {/* Team-related statistics widget */}
        <TeamBoardStatistic />

        {/* Daily productivity advice component */}
        <DailyBoardAdvice />

        {/* Project-related statistics widget */}
        <ProjectBoardStatistic />
      </div>
    </PageLayout>
  );
}
