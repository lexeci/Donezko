import { AnimatedLink, PageLayout } from "@/components/index";
import { INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";

import styles from "@/app/page.module.scss";

/**
 * Metadata object for the About page defining the title and SEO constants.
 */
export const metadata: Metadata = {
  // Page title for the About page
  title: "About us",
  // Spread common SEO properties from INDEX_PAGE constant
  ...INDEX_PAGE,
};

/**
 * About page component renders information about the TPlanner project,
 * its team, story, open source philosophy, and contribution invitation.
 *
 * @returns {JSX.Element} The rendered About page content within the PageLayout wrapper
 */
export default function About() {
  return (
    <PageLayout>
      {/* Section introducing the About page */}
      <div className={styles["page-section"]}>
        {/* Section title with heading "About us" */}
        <div className={styles["section-title"]}>
          <h4>About us</h4>
        </div>

        {/* Main title for the section */}
        <div className={styles["main-title"]}>
          <h2>Time to get know each others</h2>
        </div>

        {/* Introductory paragraph about TPlanner */}
        <div className={styles["intro-text"]}>
          <p>
            TPlanner - is new way to create your time or task management habits.
            There you will get most profits from scheduling your whole day.
          </p>
        </div>
      </div>

      {/* Main content block with detailed info */}
      <div className={styles["content-block"]}>
        {/* Section header introducing "Who Are We?" */}
        <h3 className={styles["section-header"]}>Who Are We? 🤔</h3>

        {/* Clear paragraph describing the team and mission */}
        <p className={styles["content-paragraph-clear"]}>
          We’re a small group of over-caffeinated developers who dared to dream
          big. Our goal? Build a tool that keeps people productive while subtly
          reminding them to take a break now and then (seriously, go drink some
          water).
        </p>

        {/* Section header introducing "Our Story" */}
        <h3 className={styles["section-header"]}>Our Story 📖</h3>

        {/* Introductory paragraph telling the origin story */}
        <p className={styles["intro-paragraph"]}>
          It all started during a late-night brainstorming session, fueled by
          the realization that planning and deadlines weren’t going to magically
          sort themselves out. Armed with IDEs, snacks, and the occasional
          coffee, we embarked on this journey to create TPlanner.
        </p>

        {/* Team section showing the people behind the project */}
        <div className={styles["team-section"]}>
          <h3 className={styles["section-header"]}>
            The People Behind TPlanner 👩‍💻👨‍💻
          </h3>

          {/* Container for individual team member cards */}
          <div className={styles["team-members"]}>
            {/* Individual member card with name, role, and fun fact */}
            <div className={styles["member-card"]}>
              <h4>Andriy Neaijko</h4>
              <p>UI/UX Wizard ✨</p>
              <p>Favorite tool: Figma & Cat memes</p>
            </div>

            {/* Another member card */}
            <div className={styles["member-card"]}>
              <h4>Andriy Neaijko</h4>
              <p>Backend Overlord ⚙️</p>
              <p>Favorite debug strategy: *"Turn it off and on again"*.</p>
            </div>

            {/* Another member card */}
            <div className={styles["member-card"]}>
              <h4>Andriy Neaijko</h4>
              <p>Frontend Guru 🌐</p>
              <p>Dreams in JavaScript and CSS animations.</p>
            </div>
          </div>
        </div>

        {/* Section header for open source philosophy */}
        <h3 className={styles["section-header"]}>Why Open Source? 🌍</h3>

        {/* Paragraph explaining the motivation behind open source */}
        <p className={styles["intro-paragraph"]}>
          We believe in sharing knowledge and building something greater
          together. TPlanner is for everyone—whether you’re a student struggling
          with assignments, a professional juggling deadlines, or someone who
          just really loves a good to-do list.
        </p>

        {/* Section header inviting contributions */}
        <h3 className={styles["section-header"]}>Join Us! 🚀</h3>

        {/* Paragraph encouraging contribution with a link to guidelines */}
        <p className={styles["intro-paragraph"]}>
          Want to contribute? We’d love your help! Check out our
          {/* Animated link to contribution guidelines page */}
          <AnimatedLink
            negative
            link="/contribution-guidelines"
            title="Contribution Guidelines"
          />
          and let’s build something amazing together. We promise it’ll be fun
          (and maybe a little chaotic). Just like life.
        </p>

        {/* Footer text block with a friendly note */}
        <div className={styles["footer-text-block"]}>
          <p className={styles["footer-text"]}>
            P.S. Remember, every great project starts with an idea... and a lot
            of perseverance. Also, if you’re reading this instead of working,
            you’re totally procrastinating. Go plan your next task with
            TPlanner! 😉
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
