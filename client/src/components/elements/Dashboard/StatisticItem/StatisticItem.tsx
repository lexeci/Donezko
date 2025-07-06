import { AnimatedLink } from "@/components/index";
import { ReactNode } from "react";
import styles from "./StatisticItem.module.scss";

type StatisticItemProps = {
  /**
   * Icon component to display (e.g., <UsersThree />, <Buildings />, <Rss />).
   */
  icon: ReactNode;
  /**
   * Title text of the statistic item.
   */
  title: string;
  /**
   * Optional description text providing more details.
   */
  description?: string;
  /**
   * Optional subtitle, such as "Teams" or "Tasks".
   */
  subtitle?: string;
  /**
   * Optional link with href and display text.
   */
  link?: { href: string; text: string };
};

/**
 * StatisticItem component renders an icon with title, subtitle, description, and an optional link.
 *
 * @param {StatisticItemProps} props - Props including icon, title, description, subtitle, and optional link.
 * @returns {JSX.Element} A styled statistic item with interactive link if provided.
 */
export default function StatisticItem({
  icon,
  title,
  description,
  subtitle,
  link,
}: StatisticItemProps) {
  return (
    <div className={styles["statistic-item"]}>
      {icon}
      <div className={styles.about}>
        <div className={styles.title}>
          <h5>{title}</h5>
          {subtitle && <p>{`[${subtitle}]`}</p>}
        </div>
        <div className={styles.description}>
          <p>{description}</p>
        </div>
      </div>
      {link && <AnimatedLink link={link.href} title={link.text} negative />}
    </div>
  );
}
