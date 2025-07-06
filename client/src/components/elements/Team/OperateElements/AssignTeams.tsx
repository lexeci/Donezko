import { Button } from "@/components/index";
import { TeamsResponse } from "@/types/team.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { UserList } from "@phosphor-icons/react/dist/ssr";
import styles from "./OperateElements.module.scss";
import pageStyles from "@/app/page.module.scss";

/**
 * AssignTeams Component
 *
 * @module AssignTeams
 * @description
 * Displays a list of teams that are not yet assigned to a specific project.
 * Allows the user to assign any of these teams to the project by clicking an "Assign" button.
 *
 * @param {Object} props - Component properties
 * @param {string | null} props.projectId - The ID of the current project (may be null)
 * @param {string} [props.projectTitle] - The title of the current project (optional, used for display)
 * @param {string | null} props.organizationId - The ID of the current organization (may be null)
 * @param {TeamsResponse[]} props.unAssignedTeams - Array of teams not assigned to the project
 * @param {(teamId: string) => void} props.handleAssign - Callback function fired when assigning a team
 *
 * @returns {JSX.Element} Rendered list of unassigned teams or an empty state message if none are available
 *
 * @example
 * <AssignTeams
 *   projectId="123"
 *   projectTitle="New Website Launch"
 *   organizationId="org-456"
 *   unAssignedTeams={[
 *     { id: "team1", title: "Dev Team", description: "Handles development", _count: { teamUsers: 5 } },
 *     { id: "team2", title: "QA Team", description: "Quality assurance", _count: { teamUsers: 3 } }
 *   ]}
 *   handleAssign={(teamId) => console.log("Assign team", teamId)}
 * />
 */
export function AssignTeams({
  projectId,
  projectTitle,
  organizationId,
  unAssignedTeams,
  handleAssign,
}: {
  projectId: string | null;
  projectTitle?: string;
  organizationId: string | null;
  unAssignedTeams: TeamsResponse[];
  handleAssign: (teamId: string) => void;
}) {
  return (
    <div className={styles.tab}>
      {/* Header and description */}
      <div className={styles["short-info"]}>
        <div className={styles.title}>
          <h5>
            Link a team to your project {projectTitle ? projectTitle : ""}
          </h5>
        </div>
        <div className={styles["text-block"]}>
          <p>
            These are the available teams that can be assigned to your project.
          </p>
        </div>
      </div>

      {/* Teams list or empty state */}
      <div className={styles["operate-window"]}>
        {unAssignedTeams && unAssignedTeams.length > 0 ? (
          unAssignedTeams.map((item, i) => (
            <div
              className={styles["operate-window__item"]}
              key={generateKeyComp(`${item.title}__${i}`)}
            >
              {/* Icon */}
              <UserList size={48} className={styles["operate-window__ico"]} />

              {/* Team info */}
              <div className={styles["operate-window__about"]}>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__name"]
                  }
                >
                  <p>Title: {item.title}</p>
                </div>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__email"]
                  }
                >
                  <p>Description: "{item.description}"</p>
                </div>
                <div
                  className={
                    pageStyles["workspace-user-list__users__item__participants"]
                  }
                >
                  <p>Participants: "{item._count?.teamUsers}"</p>
                </div>
              </div>

              {/* Assign button */}
              <div
                className={
                  pageStyles["workspace-user-list__users__item__actions"]
                }
              >
                <Button
                  type="button"
                  block
                  negative
                  onClick={() => handleAssign(item.id)}
                >
                  Assign
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className={pageStyles["workspace-user-list__not-found"]}>
            <h5>No available teams in the current organization</h5>
          </div>
        )}
      </div>
    </div>
  );
}
