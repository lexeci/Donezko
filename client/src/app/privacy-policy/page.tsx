import { PageLayout } from "@/components/index";
import { INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";

import styles from "@/app/page.module.scss";

/**
 * Metadata configuration for the Privacy Policy page,
 * including the page title and SEO constants.
 */
export const metadata: Metadata = {
  title: "Privacy Policy",
  ...INDEX_PAGE,
};

/**
 * PrivacyPolicy component renders the Privacy Policy page
 * with a clear and friendly explanation of how user data
 * is handled and protected.
 *
 * @returns {JSX.Element} The rendered Privacy Policy page layout
 */
export default function PrivacyPolicy() {
  return (
    <PageLayout>
      {/* Main page section with title and introductory message */}
      <div className={styles["page-section"]}>
        {/* Section title for the page */}
        <div className={styles["section-title"]}>
          <h4>Privacy Policy</h4>
        </div>

        {/* Main title with privacy reassurance */}
        <div className={styles["main-title"]}>
          <h2>
            Your privacy is important, but we’re not spying on you... Promise!
          </h2>
        </div>

        {/* Introductory paragraph about privacy commitment */}
        <div className={styles["intro-text"]}>
          <p>
            We care about your privacy—just not in a creepy way. We want you to
            feel safe while using Donezko. No funny business, no third-party
            sales, and definitely no sharing your secret chocolate cake recipe.
          </p>
        </div>
      </div>

      {/* Content block describing detailed privacy practices */}
      <div className={styles["content-block"]}>
        {/* Intro header describing data handling */}
        <h3 className={styles["section-header"]}>
          Here's what we do (and don't do!) with your data:
        </h3>

        {/* Introductory paragraph welcoming users */}
        <p className={styles["intro-paragraph"]}>
          Welcome to TPlanner’s Privacy Policy! 🎉 We're just developers trying
          to make a useful app to keep your life in order. But we also respect
          your privacy and want to be transparent with how we handle your data.
        </p>

        {/* Section 1: Data collection */}
        <h2 className={styles["section-title"]}>1. Data We Collect 📊</h2>
        <div className={styles["content-block-ul"]}>
          <p className={styles["content-paragraph-ul"]}>
            We collect a few things that are essential to making Donezko work.
            This includes:
          </p>
          <ul className={styles["content-ul"]}>
            <li>Your account information (if you sign up, of course).</li>
            <li>
              Your tasks, schedules, and notes—so we can help you organize your
              life.
            </li>
            <li>
              Device data like browser type and operating system (nothing too
              scary, just to improve performance!).
            </li>
          </ul>
        </div>

        {/* Section 2: No selling data */}
        <h2 className={styles["section-title"]}>
          2. We Don’t Sell Your Data 💸🚫
        </h2>
        <p className={styles["content-paragraph"]}>
          We’re not in the business of selling your data to the highest bidder.
          Donezko is an open-source project, and we’re here to help people—not
          make money off of your personal details. Your data stays with you.
        </p>

        {/* Section 3: No tracking */}
        <h2 className={styles["section-title"]}>
          3. We Don't Track You (Promise!) 🚫📍
        </h2>
        <p className={styles["content-paragraph"]}>
          Donezko doesn’t track your every move across the internet. If you're
          thinking about your favorite pizza place while using the app, we won’t
          be sending that info to anyone. The only thing we track is your tasks
          and schedules (because that’s what we’re about!).
        </p>

        {/* Section 4: Security */}
        <h2 className={styles["section-title"]}>
          4. Security? Yes, Please! 🔒
        </h2>
        <p className={styles["content-paragraph"]}>
          Your data is stored securely. We use industry-standard encryption and
          best practices to ensure your information stays private. So, rest easy
          knowing your secrets (and that secret project) are safe with us. 😌
        </p>

        {/* Section 5: User rights */}
        <h2 className={styles["section-title"]}>5. Your Rights 📝</h2>
        <div className={styles["content-block-ul"]}>
          <p className={styles["content-paragraph-ul"]}>
            You have the right to:
          </p>
          <ul className={styles["content-ul"]}>
            <li>Access your data anytime—no questions asked.</li>
            <li>Update or delete your personal information.</li>
            <li>
              Request that we stop processing your data (we’ll be sad, but we’ll
              respect your decision).
            </li>
          </ul>
        </div>

        {/* Section 6: No lawyers */}
        <h2 className={styles["section-title"]}>
          6. No Lawyers Allowed (Again!) 👨‍⚖️🚫
        </h2>
        <p className={styles["content-paragraph"]}>
          These are just the basics of how we handle your data. We’re
          developers, not lawyers, so this is as simple as it gets. Donezko is
          here to help, and we want you to enjoy using it without any hassle.
        </p>

        {/* Section 7: Use at your own risk */}
        <h2 className={styles["section-title"]}>7. Use at Your Own Risk ⚠️</h2>
        <p className={styles["content-paragraph"]}>
          We’re not responsible for anything that might go wrong with your
          schedule or productivity while using Donezko. We’re all in this
          together, but if something breaks, we’ll try to help you fix it. After
          all, that’s what open-source is for! 🛠️
        </p>

        {/* Footer thanking users */}
        <div className={styles["footer-text-block"]}>
          <p className={styles["footer-text"]}>
            Thanks for using Donezko! We hope it helps you organize your life,
            but don’t expect it to do your laundry just yet. 😉
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
