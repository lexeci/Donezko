"use client";

import { StatisticBlock, StatisticItem } from "@/components/index";
import generateKeyComp from "@/utils/generateKeyComp";
import { Buildings } from "@phosphor-icons/react/dist/ssr";

import { useOrganization } from "@/context/OrganizationContext";
import { useFetchProjects } from "@/hooks/project/useFetchProjects";
import { useFetchOrgRole } from "@/src/hooks/organization/useFetchOrgRole";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import { OrgRole } from "@/src/types/org.types";
import styles from "./ProjectBoardStatistic.module.scss";

/**
 * NotFoundElement component displays a message when no projects are found
 *
 * @returns {JSX.Element} Message indicating no projects are available
 */
function NotFoundElement() {
  return (
    <div className={styles["error-found"]}>
      <div className={styles.title}>
        <h5>You don't have any projects</h5>{" "}
        {/* Inform user no projects exist */}
      </div>
      <div className={styles.description}>
        <p>Please join in or create your personal project</p>{" "}
        {/* Suggest next steps */}
      </div>
    </div>
  );
}

/**
 * ProjectBoardStatistic component fetches and displays a list of projects
 * with their details as StatisticItems, or a fallback message if none found.
 *
 * @returns {JSX.Element} StatisticBlock with project items or not found message
 */
export default function ProjectBoardStatistic() {
  const { organizationId } = useOrganization(); // Get current organization ID from context
  const { organizationRole } = useFetchOrgRole(organizationId); // Fetch user's role in organization
  const { projects } = useFetchProjects(organizationId); // Fetch projects under organization

  return (
    <StatisticBlock
      title="Your Projects" // Block title
      description="Projects with assigned tasks" // Block description
      button={{ title: "Show all", link: DASHBOARD_PAGES.PROJECTS }} // Button linking to projects page
    >
      {/* Check if user has a role other than VIEWER and projects are loaded */}
      {organizationRole &&
      organizationRole.role !== OrgRole.VIEWER &&
      projects ? (
        projects.length > 0 ? (
          projects.map((project, i) => {
            const { _count, title, description, id } = project; // Destructure project data

            return (
              <StatisticItem
                key={generateKeyComp(`${title}__${i}`)} // Generate stable unique key for each item
                icon={<Buildings size={32} />} // Icon representing projects
                title={title} // Project title
                description={description} // Project description
                subtitle={`Participants: ${_count?.projectTeams}`} // Show number of project participants
                link={{
                  href: `${DASHBOARD_PAGES.PROJECTS}/${id}`, // Link to project details page
                  text: "Look -->", // Link text
                }}
              />
            );
          })
        ) : (
          <NotFoundElement /> // Show message if no projects exist
        )
      ) : (
        <NotFoundElement /> // Show message if no permission or data unavailable
      )}
    </StatisticBlock>
  );
}
