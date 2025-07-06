import { AsciiElement, PageLayout } from "@/components/index";
import { INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";

import styles from "@/app/page.module.scss";

/**
 * Metadata for the About page describing the website project story.
 */
export const metadata: Metadata = {
  title: "Behind the code",
  ...INDEX_PAGE,
};

/**
 * About component renders the "Behind the code" page,
 * sharing a playful insight into the project's creation with ASCII art.
 *
 * @returns {JSX.Element} The rendered About page component
 */
export default function About() {
  return (
    <PageLayout>
      {/* Section containing page heading and introduction */}
      <div className={styles["page-section"]}>
        {/* Small section title */}
        <div className={styles["section-title"]}>
          <h4>Behind the code</h4>
        </div>

        {/* Main title describing the page theme */}
        <div className={styles["main-title"]}>
          <h2>That how we created our website project</h2>
        </div>

        {/* Introductory text with a humorous message */}
        <div className={styles["intro-text"]}>
          <p>
            We wanted to add a feature that brings coffee, but our server said
            'Nope.
          </p>
        </div>
      </div>

      {/* Content block with ASCII art and related text */}
      <div className={styles["content-block-conga"]}>
        {/* ASCII art section */}
        <div className={styles["content-block-conga__ascii-art"]}>
          <AsciiElement types="conga" />
        </div>

        {/* Text content next to ASCII art */}
        <div className={styles["content-block-conga__content"]}>
          <h3>Conga! Conga! Conga!</h3>
          <p>Come on , shake your body baby, do the conga</p>
        </div>
      </div>
    </PageLayout>
  );
}
