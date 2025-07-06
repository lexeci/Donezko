import {
  Banner,
  Faqs,
  Features,
  PageLayout,
  Welcome,
} from "@/components/index";
import { INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";

/**
 * Metadata object for the Home page, including title and SEO configuration.
 * Spread operator includes additional metadata from INDEX_PAGE constant.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: "Homepage",
  ...INDEX_PAGE,
};

/**
 * Home component represents the main landing page of the application.
 * It renders a page layout with the following sections in order:
 * - Banner: Promotional or welcome banner
 * - Features: Key features or selling points
 * - Faqs: Frequently asked questions
 * - Welcome: Closing welcome or introduction section
 *
 * @returns {JSX.Element} - The rendered homepage content wrapped in PageLayout
 */
export default function Home() {
  return (
    <PageLayout>
      <Banner />
      <Features />
      <Faqs />
      <Welcome />
    </PageLayout>
  );
}
