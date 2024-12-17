import { AnimatedLink } from "@/src/components/ui";
import {
  ChartPie,
  GitBranch,
  ProjectorScreen,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

import styles from "./Features.module.scss";

export default function Features() {
  return (
    <div className={styles.features}>
      <div className={styles.sectionTitle}>
        <h4>Features</h4>
      </div>
      <div className={styles.mainTitle}>
        <h2>Main Features Of TPlanner</h2>
      </div>
      <div className={styles.textBlock}>
        <p>
          There is main features of our application that you might notice. Take
          a closer look over it.
        </p>
      </div>
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.icon}>
            <GitBranch size={42} />
          </div>
          <div className={styles.title}>
            <h3>Free and Open-Source!</h3>
          </div>
          <div className={styles.textBlock}>
            <p>
              Our project is free and open-sourced which means you don't need
              worry about how we deal with your information.
            </p>
            <AnimatedLink negative link="#" title="Learn more ->" />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.icon}>
            <ChartPie size={42} />
          </div>
          <div className={styles.title}>
            <h3>Manage your organization!</h3>
          </div>
          <div className={styles.textBlock}>
            <p>
              You can create your own organization inside this application
              whenever you want and rule it as you pleased.
            </p>
            <AnimatedLink negative link="#" title="Learn more ->" />
          </div>
        </div>
        <div className={`${styles.item} row-start-2`}>
          <div className={styles.icon}>
            <UsersThree size={42} />
          </div>
          <div className={styles.title}>
            <h3>Get into new Team!</h3>
          </div>
          <div className={styles.textBlock}>
            <p>
              You can be a new participant of great team through your
              organization. Create a teamwork, task, even more in our
              application.
            </p>
            <AnimatedLink negative link="#" title="Learn more ->" />
          </div>
        </div>
        <div className={`${styles.item} row-start-2`}>
          <div className={styles.icon}>
            <ProjectorScreen size={42} />
          </div>
          <div className={styles.title}>
            <h3>Create a outstanding projects!</h3>
          </div>
          <div className={styles.textBlock}>
            <p>
              Create a projects inside your organization. Manage it, prove it,
              do it. Everything that's possible to make your wish true.
            </p>
            <AnimatedLink negative link="#" title="Learn more ->" />
          </div>
        </div>
      </div>
    </div>
  );
}
