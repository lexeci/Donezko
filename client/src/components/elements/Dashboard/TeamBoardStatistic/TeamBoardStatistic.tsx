"use client";

import { StatisticBlock, StatisticItem } from "@/components/index";
import { useFetchUserTeams } from "@/hooks/team/useFetchUserTeams";
import { UsersThree } from "@phosphor-icons/react/dist/ssr";

import { useOrganization } from "@/context/OrganizationContext";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";
import styles from "./TeamBoardStatistic.module.scss";

/**
 * Component to display when no teams are found.
 *
 * @returns {JSX.Element} The "no teams" message UI.
 */
function NotFoundElement() {
  return (
    <div className={styles["error-found"]}>
      <div className={styles.title}>
        <h5>You don't have any teams</h5>
      </div>
      <div className={styles.description}>
        <p>Please join in or create your personal team</p>
      </div>
    </div>
  );
}

/**
 * TeamBoardStatistic component renders a block showing the user's teams with task counts.
 *
 * It fetches teams for the current organization and displays them with links to team details.
 * If no teams are found, a friendly message is shown.
 *
 * @returns {JSX.Element} The team statistics UI block.
 */
export default function TeamBoardStatistic() {
  const { organizationId } = useOrganization();
  const { userTeamList } = useFetchUserTeams(organizationId);

  return (
    <StatisticBlock
      title="Your Teams"
      description="Teams with assigned tasks"
      button={{ title: "Show all", link: DASHBOARD_PAGES.TEAMS }}
    >
      {userTeamList ? (
        userTeamList.length > 0 ? (
          userTeamList.map((team, i) => (
            <StatisticItem
              key={i}
              icon={<UsersThree size={32} />}
              title={team.title}
              description={team.description}
              subtitle={`Tasks: ${team._count?.tasks}`}
              link={{
                href: `${DASHBOARD_PAGES.TEAMS}/${team.id}`,
                text: "Look -->",
              }}
            />
          ))
        ) : (
          <NotFoundElement />
        )
      ) : (
        <NotFoundElement />
      )}
    </StatisticBlock>
  );
}
