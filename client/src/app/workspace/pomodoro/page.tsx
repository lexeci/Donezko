import pageStyles from "@/app/page.module.scss";
import { PageHeader, PageLayout, Timer } from "@/components/index";
import { NO_INDEX_PAGE, SITE_NAME } from "@/constants/seo.constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  // Metadata for Pomodoro Timer page with no-index for SEO
  title: `${SITE_NAME} - Pomodoro Timer`,
  ...NO_INDEX_PAGE,
};

/**
 * Pomodoro page component renders the Pomodoro timer interface.
 *
 * It includes a page header describing the timer and a centered Timer component.
 *
 * @returns {JSX.Element} The Pomodoro timer page content
 */
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
