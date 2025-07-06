import { SmileyNervous } from "@phosphor-icons/react/dist/ssr";

import pageStyles from "@/app/page.module.scss";

/**
 * NotFoundId component displays a message when a specific element is not found.
 *
 * @param {object} props
 * @param {string} props.elementTitle The title or name of the missing element (e.g., "Organization")
 */
export default function NotFoundId({ elementTitle }: { elementTitle: string }) {
  return (
    <div className={pageStyles["workspace-not-found-block"]}>
      {/* Icon with bounce animation */}
      <SmileyNervous size={80} className="!animate-bounce" />

      {/* Title message indicating the element was not found */}
      <div className={pageStyles["workspace-not-found-block__title"]}>
        <h3>
          Oops! <span>{elementTitle}</span> not found.
        </h3>
      </div>

      {/* Explanatory text with friendly tone */}
      <div className={pageStyles["workspace-not-found-block__text-block"]}>
        <p>
          It seems this <span>{elementTitle}</span> has gone on an unexpected
          vacation.
          <br />
          Maybe it was deleted, or perhaps you no longer have access.
          <br />
          {
            "(Try refreshing the page or contact your admin if you think this is a mistake.)"
          }
        </p>
      </div>
    </div>
  );
}
