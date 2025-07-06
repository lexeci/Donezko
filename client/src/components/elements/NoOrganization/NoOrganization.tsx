import { SmileyMeh } from "@phosphor-icons/react/dist/ssr";
import pageStyles from "@/app/page.module.scss";

/**
 * NoOrganization component displays a message prompting the user to select an organization.
 *
 * @returns {JSX.Element} The UI block indicating that no organization is selected.
 */
export default function NoOrganization() {
  return (
    <div className={pageStyles["workspace-not-found-block"]}>
      {/* Icon indicating neutral expression */}
      <SmileyMeh size={80} />

      {/* Title prompting user to select an organization */}
      <div className={pageStyles["workspace-not-found-block__title"]}>
        <h3>You need to select an organization.</h3>
      </div>

      {/* Instructions for how to select an organization */}
      <div className={pageStyles["workspace-not-found-block__text-block"]}>
        <p>
          Before you start you should choose an organization.
          <br />
          You can do it by choosing it from header or on the left sidebar.
          <br />
          {"(Choose an organizations tab and click the available one for you)"}
        </p>
      </div>
    </div>
  );
}
