import { Button } from "@/components/ui";
import { HandPointing } from "@phosphor-icons/react/dist/ssr";

import styles from "./Faqs.module.scss";

/**
 * Faqs component encourages users to consult documentation when stuck,
 * providing a call-to-action button linking to the docs.
 *
 * @returns {JSX.Element} The FAQs banner UI element
 */
export default function Faqs() {
  return (
    <div className={styles.faqsBanner}>
      {/* Section subtitle */}
      <div className={styles.sectionTitle}>
        <h4>Get stuck?</h4>
      </div>

      {/* Main title */}
      <div className={styles.mainTitle}>
        <h2>There is documentation for you</h2>
      </div>

      {/* Informational text */}
      <div className={styles.textBlock}>
        <p>
          You can find any answers for any question in our documentation. Take a
          look and find more about how using our application
        </p>
      </div>

      {/* Button linking to documentation with icon */}
      <Button type="link" link="#" negative>
        Go to Documentation
        <HandPointing className={styles.button} size={22} cursor="pointer" />
      </Button>
    </div>
  );
}
