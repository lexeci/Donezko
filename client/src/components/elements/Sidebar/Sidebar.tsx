"use client";

import { Button } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { OrgRole } from "@/types/org.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import styles from "./Sidebar.module.scss";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";

/**
 * Sidebar component
 *
 * Displays navigation links in the sidebar with conditional rendering based on
 * the user's organization membership and role.
 *
 * @component
 * @example
 * return <Sidebar />
 *
 * @returns {JSX.Element} Sidebar navigation panel
 */
export default function Sidebar() {
  // Get current organization ID from context
  const { organizationId } = useOrganization();

  // Fetch the current user's role in the organization
  const { organizationRole } = useFetchOrgRole(organizationId);

  // Basic navigation links visible to all users
  const baseLinks = [
    { link: DASHBOARD_PAGES.HOME, title: "Dashboard" },
    { link: DASHBOARD_PAGES.TIMER, title: "Pomodoro Timer" },
    { link: DASHBOARD_PAGES.SETTINGS, title: "Settings" },
  ];

  // Additional links only visible to non-viewer roles
  const additionalLinks = [
    { link: DASHBOARD_PAGES.TASKS, title: "Tasks" },
    { link: DASHBOARD_PAGES.TEAMS, title: "Teams" },
    { link: DASHBOARD_PAGES.PROJECTS, title: "Projects" },
  ];

  // State for currently displayed links
  const [links, setLinks] = useState(baseLinks);

  useEffect(() => {
    const isViewer = organizationRole?.role === OrgRole.VIEWER;
    let updatedLinks = [...baseLinks];

    if (organizationId) {
      // Insert "My Organization" link after Dashboard
      updatedLinks.splice(1, 0, {
        link: `${DASHBOARD_PAGES.ORGANIZATIONS}/${organizationId}`,
        title: "My Organization",
      });

      if (!isViewer) {
        // Insert additional links between Pomodoro Timer and Settings
        const pomodoroIndex = updatedLinks.findIndex(
          (link) => link.title === "Pomodoro Timer"
        );
        updatedLinks.splice(pomodoroIndex + 1, 0, ...additionalLinks);
      }
    } else {
      // If no organization, add Organizations link after Dashboard
      updatedLinks.splice(1, 0, {
        link: DASHBOARD_PAGES.ORGANIZATIONS,
        title: "Organizations",
      });
    }

    setLinks(updatedLinks);
  }, [organizationId, organizationRole]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.container}>
        <div className={styles["container__links"]}>
          {links.map((item, i) => (
            <Button
              type="link"
              link={item.link}
              fullWidth
              block
              negative
              key={generateKeyComp(`${item.title}__${i}`)}
            >
              {item.title}
            </Button>
          ))}
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}
