import { WifiX } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";

import styles from "./NoConnection.module.scss";
import pageStyles from "@/app/page.module.scss";

/**
 * NoConnection component shows a friendly message indicating
 * that there is no internet connection available.
 *
 * @returns {JSX.Element} The UI block indicating lack of internet connection.
 */
export default function NoConnection() {
  return (
    <div
      className={clsx(
        pageStyles["workspace-not-found-block"],
        styles["no-connection"]
      )}
    >
      {/* Icon with gentle shake animation indicating no WiFi */}
      <div className="!animate-gentle-shake">
        <WifiX size={80} />
      </div>

      {/* Title message */}
      <div className={pageStyles["workspace-not-found-block__title"]}>
        <h3>Sorry, no internet connection...</h3>
      </div>

      {/* Description with playful metaphor */}
      <div className={pageStyles["workspace-not-found-block__text-block"]}>
        <p>
          Looks like your digital highway has a traffic jam. Check your
          connection and try again!
        </p>
      </div>
    </div>
  );
}
