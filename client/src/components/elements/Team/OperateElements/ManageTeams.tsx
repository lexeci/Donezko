import {Button} from "@/components/index";
import {TeamsResponse} from "@/types/team.types";
import generateKeyComp from "@/utils/generateKeyComp";
import {UserList} from "@phosphor-icons/react/dist/ssr";
import styles from "@/components/elements/Team/OperateElements/OperateElements.module.scss";
import pageStyles from "@/app/page.module.scss";

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
                    assignedTeams.map((team, i) => {
                        return (
                            <div
                                className={styles["operate-window__item"]}
                                key={generateKeyComp(`${team.title}__${i}`)}
                            >
                                <UserList
                                    size={48}
                                    className={styles["operate-window__ico"]}
                                />
                                <div className={styles["operate-window__about"]}>
                                    <div className={pageStyles["workspace-user-list__users__item__name"]}>
                                        <p>Title: {team.title}</p>
                                    </div>
                                    <div className={pageStyles["workspace-user-list__users__item__desc"]}>
                                        <p>Description: "{team.description}"</p>
                                    </div>
                                    <div className={pageStyles["workspace-user-list__users__item__participants"]}>
                                        <p>Participants: "{team._count?.teamUsers}"</p>
                                    </div>
                                </div>
                                <div className={pageStyles["workspace-user-list__users__item__actions"]}>
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
                        );
                    })
                ) : (
                    <div className={pageStyles["workspace-user-list__not-found"]}>
                        <h5>No teams are assigned to the current project</h5>
                    </div>
                )}
            </div>
        </div>
    );
}
