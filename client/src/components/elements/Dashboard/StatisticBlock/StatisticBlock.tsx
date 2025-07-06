import { Button } from "@/components/ui";
import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./StatisticBlock.module.scss"; // Import modular SCSS

type StatisticBlockProps = {
  title: string; // Title of the statistics block
  children?: ReactNode; // Optional content inside the block
  className?: string; // Optional additional CSS class names
  description: string; // Description text below the title
  button?: { title: string; link: string }; // Optional button with title and link
};

/**
 * StatisticBlock component renders a container with a header section including
 * a title, description, and an optional action button, plus a content area.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Title of the statistics block
 * @param {string} props.description - Description text shown under the title
 * @param {{ title: string; link: string }} [props.button] - Optional button with text and link URL
 * @param {ReactNode} [props.children] - Optional nested content to display inside the block
 * @param {string} [props.className] - Optional additional CSS class names for the root container
 * @returns {JSX.Element}
 */
export default function StatisticBlock({
  title,
  description,
  button,
  children,
  className,
}: StatisticBlockProps) {
  return (
    <div
      className={clsx(styles["board-statistics-block"], className)} // Combine base and optional CSS classes
    >
      <div className={styles.header}>
        <div className={styles.about}>
          <div className={styles.title}>
            <h4>{title}</h4> {/* Display the block title */}
          </div>
          <div className={styles.description}>
            <p>{description}</p> {/* Display the block description */}
          </div>
        </div>
        {/* Render button if button prop is provided */}
        {button && (
          <Button type="link" link={button.link} block negative>
            {button.title}
          </Button>
        )}
      </div>
      <div className={styles.content}>
        {children} {/* Render nested content inside the block */}
      </div>
    </div>
  );
}
