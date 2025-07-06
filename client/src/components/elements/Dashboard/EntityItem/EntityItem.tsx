import { AnimatedLink } from "@/components/ui";
import { ReactNode } from "react";

import { Minus, Square, X } from "@phosphor-icons/react/dist/ssr";
import styles from "./EntityItem.module.scss";

interface EntityItem {
  title: string;
  firstStat: string; // Statistic label, e.g. "Teams" or "Tasks"
  secondaryStat: string; // Secondary statistic label, e.g. "Teams" or "Tasks"
  icon: ReactNode; // Icon component, e.g. <Buildings /> or <UsersThree />
  linkBase: string; // Base URL for the link
  onClick?: () => void; // Optional click handler for the entire item
  hideLink?: boolean; // Optional flag to hide the link and show access message
}

/**
 * EntityItem component renders an entity with title, statistics,
 * icon, action icons, and a conditional link or access message.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Title of the entity
 * @param {string} props.firstStat - First statistic label (e.g. "Teams" or "Tasks")
 * @param {string} props.secondaryStat - Secondary statistic label
 * @param {ReactNode} props.icon - Icon representing the entity
 * @param {string} props.linkBase - Base link URL for navigation
 * @param {() => void} [props.onClick] - Optional click handler for the item container
 * @param {boolean} [props.hideLink=false] - If true, hides the link and shows access denied message
 * @returns {JSX.Element}
 */
export default function EntityItem({
  title,
  firstStat,
  secondaryStat,
  icon,
  linkBase,
  onClick,
  hideLink = false,
}: EntityItem) {
  return (
    // Wrapper div with optional click handler for item interaction
    <div className={styles.item} onClick={onClick}>
      {/* Header section with title and action icons */}
      <div className={styles.header}>
        <div className={styles.title}>
          <h4>{title}</h4> {/* Display entity title */}
        </div>
        <div className={styles.actions}>
          <div>
            <Minus size={8} /> {/* Action icon: minimize or collapse */}
          </div>
          <div>
            <Square size={8} /> {/* Action icon: maximize or restore */}
          </div>
          <div>
            <X size={8} /> {/* Action icon: close or remove */}
          </div>
        </div>
      </div>

      {/* Icon representing the entity */}
      <div className={styles.icon}>{icon}</div>

      {/* Footer section with statistics and navigation link or access message */}
      <div className={styles.footer}>
        <div className={styles.statistics}>
          <p>{firstStat}</p> {/* Display first statistic */}
          <p>{secondaryStat}</p> {/* Display secondary statistic */}
        </div>
        <div className={styles["show-more"]}>
          {/* Conditionally render AnimatedLink or access message based on hideLink */}
          {!hideLink ? (
            <AnimatedLink
              link={linkBase}
              title={onClick !== undefined ? "Choose" : "Show more"} // Link text changes if onClick is provided
            />
          ) : (
            <p>You don't have access</p> // Message shown if link is hidden due to no access
          )}
        </div>
      </div>
    </div>
  );
}
