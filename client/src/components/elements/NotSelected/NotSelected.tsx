import { SmileyWink } from "@phosphor-icons/react/dist/ssr";

import pageStyles from "@/app/page.module.scss";

/**
 * NotSelected component displays a friendly message when no item is selected.
 *
 * @param {object} props
 * @param {string} props.element The type of element that hasn't been selected yet (e.g., "Organization")
 */
export default function NotSelected({ element }: { element: string }) {
  return (
    <div className={pageStyles["workspace-not-found-block"]}>
      {/* Icon with gentle shaking animation */}
      <SmileyWink size={80} className="!animate-gentle-shake" />

      {/* Title message */}
      <div className={pageStyles["workspace-not-found-block__title"]}>
        <h3>Oops! Someone forgot to select a {element.toLowerCase()} yet.</h3>
      </div>

      {/* Friendly explanatory text */}
      <div className={pageStyles["workspace-not-found-block__text-block"]}>
        <p>
          Maybe someone forgot to approve it,
          <br /> or you simply missed the chance to pick it.
          <br />
          {"(Try selecting it again or send a gentle reminder to your admin.)"}
          <br />
          {"Cookies might help, too! :)"}
        </p>
      </div>
    </div>
  );
}
