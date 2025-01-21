import {Button} from "@/components/index";
import {TeamsResponse} from "@/types/team.types";
import generateKeyComp from "@/utils/generateKeyComp";
import {UserList} from "@phosphor-icons/react/dist/ssr";
import styles from "./OperateElements.module.scss"
import pageStyles from "@/app/page.module.scss";

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
            <div
                className={styles["operate-window"]}>
                {unAssignedTeams && unAssignedTeams.length > 0 ? (
                    unAssignedTeams.map((item, i) => {
                        return (
                            <div
                                className={styles["operate-window__item"]}
                                key={generateKeyComp(`${item.title}__${i}`)}
                            >
                                <UserList
                                    size={48}
                                    className={styles["operate-window__ico"]}
                                />
                                <div className={styles["operate-window__about"]}>
                                    <div className={pageStyles["workspace-user-list__users__item__name"]}>
                                        <p>Title: {item.title}</p>
                                    </div>
                                    <div className={pageStyles["workspace-user-list__users__item__email"]}>
                                        <p>Description: "{item.description}"</p>
                                    </div>
                                    <div className={pageStyles["workspace-user-list__users__item__participants"]}>
                                        <p>Participants: "{item._count?.teamUsers}"</p>
                                    </div>
                                </div>
                                <div className={pageStyles["workspace-user-list__users__item__actions"]}>
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
                        );
                    })
                ) : (
                    <div
                        className={pageStyles["workspace-user-list__not-found"]}>
                        <h5>No available teams in the current organization</h5>
                    </div>
                )}
            </div>
        </div>
    );
}
