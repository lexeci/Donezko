import { SmileyXEyes } from "@phosphor-icons/react/dist/ssr";

import pageStyles from "@/app/page.module.scss";

/**
 * LackPermission component displays a friendly message indicating
 * that the user does not have the necessary permissions to view the content.
 *
 * @returns {JSX.Element} The UI element showing lack of permissions notice
 */
export default function LackPermission() {
  return (
    <div className={pageStyles["workspace-not-found-block"]}>
      {/* Icon with gentle shake animation indicating lack of permission */}
      <SmileyXEyes size={80} className="!animate-gentle-shake" />

      {/* Title explaining the permission issue */}
      <div className={pageStyles["workspace-not-found-block__title"]}>
        <h3>Oops! Someone lacks permissions to view the content.</h3>
      </div>

      {/* Informative text with playful tone about permission restrictions */}
      <div className={pageStyles["workspace-not-found-block__text-block"]}>
        <p>
          It seems this has decided to take an unapproved coffee break. ☕
          <br />
          Maybe it got deleted, or perhaps you're not on the VIP guest list.
          <br />
          {
            "(Try refreshing the page, or send a friendly nudge to your admin if you think this is unfair. Perhaps bring cookies?)"
          }
        </p>
      </div>
    </div>
  );
}
