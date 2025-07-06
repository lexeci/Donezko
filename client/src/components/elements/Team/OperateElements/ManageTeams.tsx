import { Button } from "@/components/index";
import { TeamsResponse } from "@/types/team.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { UserList } from "@phosphor-icons/react/dist/ssr";
import styles from "@/components/elements/Team/OperateElements/OperateElements.module.scss";
import pageStyles from "@/app/page.module.scss";

/**
 * ManageTeams Component
 *
 * @module ManageTeams
 * @description
 * A UI component for managing and unassigning teams associated with a specific project.
 * It displays a list of currently assigned teams, including their details and an option to remove them.
 *
 * @param {Object} props
 * @param {string} props.projectTitle - The title of the current project (used for display)
 * @param {TeamsResponse[]} props.assignedTeams - Array of teams currently assigned to the project
 * @param {(teamId: string) => void} props.handleUnassign - Callback fired when a team is unassigned
 *
 * @returns {JSX.Element} Rendered list of assigned teams or an empty state message
 *
 * @example
 * <ManageTeams
 *   projectTitle="Marketing Revamp"
 *   assignedTeams={[
 *     { id: "1", title: "Design Team", description: "Handles branding", _count: { teamUsers: 4 } }
 *   ]}
 *   handleUnassign={(teamId) => console.log("Unassigned", teamId)}
 * />
 */
export function ManageTeams({
  projectTitle,
  assignedTeams,
  handleUnassign,
}: {
  projectTitle: string;
  assignedTeams: TeamsResponse[];
  handleUnassign: (teamId: string) => void;
}) {
  return (
    <div className={styles.tab}>
      <div className={styles["short-info"]}>
        <div className={styles.title}>
          <h5>Manage teams to your project {projectTitle}</h5>
        </div>
        <div className={styles["text-block"]}>
          <p>There are teams assigned to your project that can be managed.</p>
        </div>
      </div>

      <div className={styles["operate-window"]}>
        {assignedTeams && assignedTeams.length > 0 ? (
          assignedTeams.map((team, i) => (
            <div
              className={styles["operate-window__item"]}
              key={generateKeyComp(`${team.title}__${i}`)}
            >
              {/* Icon */}
              <UserList size={48} className={styles["operate-window__ico"]} />

              {/* Team details */}
              <div className={styles["operate-window__about"]}>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__name"]
                  }
                >
                  <p>Title: {team.title}</p>
                </div>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__desc"]
                  }
                >
                  <p>Description: "{team.description}"</p>
                </div>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__participants"]
                  }
                >
                  <p>Participants: "{team._count?.teamUsers}"</p>
                </div>
              </div>

              {/* Unassign action */}
              <div
                className={
                  pageStyles["workspace-user-list__users__item__actions"]
                }
              >
                <Button
                  type="button"
                  block
                  negative
                  onClick={() => handleUnassign(team.id)}
                >
                  Unassign
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className={pageStyles["workspace-user-list__not-found"]}>
            <h5>No teams are assigned to the current project</h5>
          </div>
        )}
      </div>
    </div>
  );
}
