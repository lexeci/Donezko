import { Minus, Square, X } from "@phosphor-icons/react/dist/ssr";
import { PropsWithChildren } from "react";

import clsx from "clsx";
import styles from "./WindowContainer.module.scss";

type WindowContainerProps = {
  title: string; // Title text displayed in the window header
  subtitle: string; // Subtitle or additional info shown next to the title
  fullPage?: boolean; // If true, the container expands to full page size
  autoContent?: boolean; // If true, content area adapts height automatically
  onClose?: () => void; // Optional callback function to handle close action
};

/**
 * WindowContainer component renders a styled window with a header, content area, and footer.
 * It supports optional full-page mode, automatic content sizing, and a close button callback.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The title text for the window header
 * @param {string} props.subtitle - Additional information shown alongside the title
 * @param {React.ReactNode} props.children - The content to render inside the window body
 * @param {boolean} [props.fullPage=false] - Whether the window should take full page height and width
 * @param {boolean} [props.autoContent=false] - Whether the content area height adjusts automatically
 * @param {() => void} [props.onClose] - Optional callback triggered when the close icon is clicked
 * @returns {JSX.Element}
 */
export default function WindowContainer({
  title,
  subtitle,
  children,
  fullPage = false,
  autoContent = false,
  onClose,
}: PropsWithChildren<WindowContainerProps>) {
  // Get current year for footer credentials display
  const currentYear = new Date().getFullYear();

  // Footer copyright text
  const credentials = `© TPlanner ${currentYear}. All Rights Reserved by Andriy Neaijko.`;

  return (
    <div
      className={clsx(
        styles.window,
        fullPage && styles["full-page"],
        "bg-radial-grid-small" // Background style for the window container
      )}
    >
      {/* Header section with title, subtitle, and action icons */}
      <div className={styles.header}>
        <div className={styles.title}>
          <h5>{title}</h5>
          <span>-</span>
          <p>{subtitle}</p>
        </div>
        <div className={styles.actions}>
          {/* Minimize icon (no action) */}
          <div className={styles.item}>
            <Minus size={16} />
          </div>

          {/* Maximize icon (no action) */}
          <div className={styles.item}>
            <Square size={16} />
          </div>

          {/* Close icon, calls onClose callback if provided */}
          <div
            className={clsx(styles.item, onClose && styles.closure)}
            onClick={onClose}
          >
            <X size={16} />
          </div>
        </div>
      </div>

      {/* Content area, optionally auto-sized */}
      <div
        className={clsx(styles.content, autoContent && styles["content-auto"])}
      >
        {children}
      </div>

      {/* Footer with copyright notice and an emoticon */}
      <div className={styles.footer}>
        <h5>{credentials}</h5>
        <p>{"\t(⊙＿⊙')"}</p>
      </div>
    </div>
  );
}
