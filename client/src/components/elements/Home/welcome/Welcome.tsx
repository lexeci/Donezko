import styles from "./Welcome.module.scss";

/**
 * Welcome component displays a banner encouraging users
 * to start using the planning manager application.
 *
 * @returns {JSX.Element} The welcome banner UI element
 */
export default function Welcome() {
  return (
    <div className={styles.welcomeBanner}>
      {/* Title section with main headline */}
      <div className={styles.title}>
        <h2>Start your new planning manager today!</h2>
      </div>

      {/* Text block with motivational description */}
      <div className={styles.textBlock}>
        <p>
          Don't wait when your plans overwhelm you. Get rid of them today with
          our application Donezko - time to plan your day.
        </p>
      </div>
    </div>
  );
}
