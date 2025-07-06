import { AnimatedLink, Button, Task } from "@/components/ui";
import { HandPointing } from "@phosphor-icons/react/dist/ssr";

import styles from "./Banner.module.scss";

/**
 * Banner component presents a welcoming introduction to the application,
 * including navigation links, a motivating headline, descriptive text,
 * a call-to-action button, and a decorative Task component.
 *
 * @returns {JSX.Element} The banner UI element
 */
export default function Banner() {
  return (
    <div className={styles.banner}>
      <div className={styles.container}>
        {/* Info section with navigation links and main content */}
        <div className={styles.info}>
          {/* Top navigation panel with animated links */}
          <div className={styles.topPanel}>
            <AnimatedLink link="/about" title="About project" />
            <AnimatedLink link="/behind-code" title="Behind the code" />
            <AnimatedLink link="/faqs" title="FAQ's" />
          </div>

          {/* Main content area with title, description, and action button */}
          <div className={styles.content}>
            <div className={styles.title}>
              <h1>
                Are you ready ? <br />
                Plan your day right now!
              </h1>
            </div>

            {/* Description text block */}
            <div className={styles.textBlock}>
              <p>
                Try our free task management platform. It provides Kanban boards
                and task lists, catering to both structured and flexible
                planning styles. Even more!
              </p>
            </div>

            {/* Button linking to dashboard with hand pointing icon */}
            <Button type="link" link="/auth">
              Go to Dashboard
              <HandPointing
                className={styles.hand}
                size={22}
                cursor={"pointer"}
              />
            </Button>
          </div>
        </div>

        {/* Background decorative Task component with banner styling */}
        <div className={styles.background}>
          <Task isBannerElem />
        </div>
      </div>
    </div>
  );
}
