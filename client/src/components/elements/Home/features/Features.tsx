import { AnimatedLink } from "@/components/ui";
import {
  ChartPie,
  GitBranch,
  ProjectorScreen,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

import styles from "./Features.module.scss";

/**
 * Features component displays the main features of the TPlanner application.
 * It includes icons, titles, descriptions, and links to learn more about each feature.
 *
 * @returns {JSX.Element} The features section UI element
 */
export default function Features() {
  return (
    <div className={styles.features}>
      {/* Section header with small title */}
      <div className={styles.sectionTitle}>
        <h4>Features</h4>
      </div>

      {/* Main title of the features section */}
      <div className={styles.mainTitle}>
        <h2>Main Features Of TPlanner</h2>
      </div>

      {/* Introductory description text */}
      <div className={styles.textBlock}>
        <p>
          There is main features of our application that you might notice. Take
          a closer look over it.
        </p>
      </div>

      {/* Container holding individual feature items */}
      <div className={styles.container}>
        {/* Feature item: Free and Open-Source */}
        <div className={styles.item}>
          {/* Icon representing branching */}
          <div className={styles.icon}>
            <GitBranch size={42} />
          </div>

          {/* Feature title */}
          <div className={styles.title}>
            <h3>Free and Open-Source!</h3>
          </div>

          {/* Description and link */}
          <div className={styles.textBlock}>
            <p>
              Our project is free and open-sourced which means you don't need
              worry about how we deal with your information.
            </p>
            {/* Animated link to about page */}
            <AnimatedLink negative link="/about" title="Learn more ->" />
          </div>
        </div>

        {/* Feature item: Manage your organization */}
        <div className={styles.item}>
          {/* Icon representing a pie chart */}
          <div className={styles.icon}>
            <ChartPie size={42} />
          </div>

          {/* Feature title */}
          <div className={styles.title}>
            <h3>Manage your organization!</h3>
          </div>

          {/* Description and link */}
          <div className={styles.textBlock}>
            <p>
              You can create your own organization inside this application
              whenever you want and rule it as you pleased.
            </p>
            <AnimatedLink negative link="/about" title="Learn more ->" />
          </div>
        </div>

        {/* Feature item: Get into new Team (starts on second row) */}
        <div className={`${styles.item} row-start-2`}>
          {/* Icon representing multiple users */}
          <div className={styles.icon}>
            <UsersThree size={42} />
          </div>

          {/* Feature title */}
          <div className={styles.title}>
            <h3>Get into new Team!</h3>
          </div>

          {/* Description and link */}
          <div className={styles.textBlock}>
            <p>
              You can be a new participant of great team through your
              organization. Create a teamwork, task, even more in our
              application.
            </p>
            <AnimatedLink negative link="/about" title="Learn more ->" />
          </div>
        </div>

        {/* Feature item: Create outstanding projects (starts on second row) */}
        <div className={`${styles.item} row-start-2`}>
          {/* Icon representing a projector screen */}
          <div className={styles.icon}>
            <ProjectorScreen size={42} />
          </div>

          {/* Feature title */}
          <div className={styles.title}>
            <h3>Create a outstanding projects!</h3>
          </div>

          {/* Description and link */}
          <div className={styles.textBlock}>
            <p>
              Create a projects inside your organization. Manage it, prove it,
              do it. Everything that's possible to make your wish true.
            </p>
            <AnimatedLink negative link="/about" title="Learn more ->" />
          </div>
        </div>
      </div>
    </div>
  );
}
