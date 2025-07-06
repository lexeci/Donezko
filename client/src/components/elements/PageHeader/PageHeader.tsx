import { Button } from "@/components/index";
import JoinCode from "./JoinCode";
import styles from "./PageHeader.module.scss";

interface PageHeader {
  pageTitle: string; // Main title of the page section
  title: string; // Primary heading text
  desc: string; // Main description text
  extraDesc?: string; // Optional additional description or stats
  joinCode?: string | boolean; // Optional join code to display (string or false)
  extraInfo?: string | boolean; // Optional extra informational text (string or false)
  buttonAction?: () => void; // Optional callback for button click
  button?: string | boolean; // Optional button label (string or false)
}

/**
 * PageHeader component renders a section header with titles, descriptions,
 * optional join code, extra information, and an optional action button.
 *
 * @param {Object} props - Component props
 * @param {string} props.pageTitle - The main title of the page section
 * @param {string} props.title - The primary heading text
 * @param {string} props.desc - The main description text
 * @param {string} [props.extraDesc] - Optional additional description or statistics
 * @param {string | boolean} [props.joinCode] - Optional join code to display or false if none
 * @param {string | boolean} [props.extraInfo] - Optional extra informational text or false if none
 * @param {string | boolean} [props.button] - Optional button label or false if no button
 * @param {() => void} [props.buttonAction] - Optional callback function to handle button click
 * @returns {JSX.Element}
 */
export default function PageHeader({
  pageTitle,
  title,
  desc,
  extraDesc,
  joinCode,
  extraInfo,
  button,
  buttonAction,
}: PageHeader) {
  return (
    <div className={styles["page-section"]}>
      {/* Section title area with page title, optional join code, and extra info */}
      <div className={styles["section-title"]}>
        <h4>{pageTitle}</h4>

        {/* Render JoinCode component if joinCode prop is truthy */}
        {joinCode && <JoinCode joinCode={joinCode} />}

        {/* Render extra info text if provided */}
        {extraInfo && (
          <p className={styles["join-code"]}>
            <span>{extraInfo}</span>
          </p>
        )}
      </div>

      {/* Main title area with heading and optional button */}
      <div className={styles["main-title"]}>
        <h2>{title}</h2>

        {/* Render button if button label is truthy */}
        {button && (
          <Button type="button" fullWidth block negative onClick={buttonAction}>
            {button}
          </Button>
        )}
      </div>

      {/* Description area with main description and optional extra description */}
      <div className={styles["intro-text"]}>
        <p>{desc}</p>
        {extraDesc && (
          <p className={styles["intro-text__statistics"]}>{extraDesc}</p>
        )}
      </div>
    </div>
  );
}
