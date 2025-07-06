import { Accordion, PageLayout } from "@/components/index";
import { INDEX_PAGE } from "@/constants/seo.constants";
import generateKeyComp from "@/utils/generateKeyComp";
import { Metadata } from "next";

import styles from "@/app/page.module.scss";

/**
 * Metadata object for the FAQ page, including title and SEO constants.
 */
export const metadata: Metadata = {
  title: "FAQ's - most common questions",
  ...INDEX_PAGE,
};

/**
 * Faqs component renders the Frequently Asked Questions page for Donezko.
 * It displays a list of common questions and their answers using Accordion components.
 *
 * @returns {JSX.Element} The rendered FAQ page component
 */
export default function Faqs() {
  // Array of FAQ questions and their corresponding answers
  const questions = [
    {
      title: "What is x-data?",
      answer:
        "x-data is a directive in Alpine.js that allows you to declare component data.",
    },
    {
      title: "How does Donezko work?",
      answer:
        "Donezko helps you organize your tasks and schedule in a user-friendly interface.",
    },
    {
      title: "How to contribute?",
      answer:
        "You can contribute by forking the repository and submitting pull requests.",
    },
    {
      title: "What is open-source?",
      answer:
        "Open-source means that the source code is freely available for anyone to use, modify, and distribute.",
    },
    {
      title: "Is Donezko free?",
      answer: "Yes, Donezko is completely free to use and open-source.",
    },
  ];

  return (
    <PageLayout>
      {/* Page section containing page title and introductory text */}
      <div className={styles["page-section"]}>
        {/* Section title with a small heading */}
        <div className={styles["section-title"]}>
          <h4>FAQ's</h4>
        </div>

        {/* Main title describing the FAQ page purpose */}
        <div className={styles["main-title"]}>
          <h2>Most common questions about Donezko</h2>
        </div>

        {/* Introductory paragraph explaining the FAQ page intent */}
        <div className={styles["intro-text"]}>
          <p>
            The FAQ's page contains answers to the most frequently asked
            questions of users. We want to make your experience with Donezko as
            comfortable as possible.
          </p>
        </div>
      </div>

      {/* Content block with FAQ questions listed as Accordion components */}
      <div className={styles["content-block"]}>
        {/* Section header inviting users to find answers */}
        <h3 className={styles["section-header"]}>
          Hey! You can find the answers for you questions:
        </h3>

        {/* Brief paragraph introducing the list of FAQs */}
        <p className={styles["intro-paragraph"]}>
          All most asked question to our project:
        </p>

        {/* Map over questions array to render an Accordion for each FAQ */}
        {questions.map((item, i) => (
          <Accordion
            title={item.title}
            answer={item.answer}
            key={generateKeyComp(`${item.title}_${i}`)} // Generate unique key for each Accordion item
          />
        ))}
      </div>
    </PageLayout>
  );
}
