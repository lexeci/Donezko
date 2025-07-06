import { PropsWithChildren } from "react"; // Import type helper for components with children
import styles from "./PageLayout.module.scss"; // Import CSS module styles

/**
 * PageLayout component wraps its children with a styled container.
 *
 * @param {PropsWithChildren<{}>} props - React props containing children elements
 * @returns {JSX.Element} - A div with a page style wrapping children components
 */
export default function PageLayout({ children }: PropsWithChildren<{}>) {
  return (
    // Container div applying page-specific styles from CSS module
    <div className={styles.page}>
      {/* Render nested components or elements passed as children */}
      {children}
    </div>
  );
}
