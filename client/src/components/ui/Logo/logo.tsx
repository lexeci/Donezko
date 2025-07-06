import Link from "next/link";
import styles from "./logo.module.scss";

/**
 * Logo component renders the site logo as a clickable link to the homepage.
 *
 * @component
 * @returns {JSX.Element} The logo element linking to the root URL.
 */
export default function Logo() {
  return (
    <div className={styles.logo}>
      <Link href="/">
        <strong>Donezko.com</strong>
      </Link>
    </div>
  );
}
