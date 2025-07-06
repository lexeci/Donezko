import { AnimatedLink } from "@/components/index";
import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";

import styles from "./not-found.module.scss";

/**
 * Metadata object for the 404 Not Found page.
 * Title is customized, and SEO indexing is disabled using NO_INDEX_PAGE.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: "Oh, no! Wrong page anyway...",
  ...NO_INDEX_PAGE,
};

/**
 * NotFoundPage component renders a custom 404 error page with a message
 * and a link to return to the homepage.
 *
 * @returns {JSX.Element} - The rendered 404 page
 */
export default function NotFoundPage() {
  return (
    <div className={styles["not-found"]}>
      {/* Display the 404 error code */}
      <p>4 0 4</p>

      {/* Display a humorous message for the user */}
      <p>Guess today is not your day if you are on this page.</p>

      {/* Render a link back to the homepage */}
      <AnimatedLink link="/" title="Please return me home!" />
    </div>
  );
}
