import {Dispatch, SetStateAction, useState} from "react";

import {AsciiElement} from "@/src/components/ui";
import {formatTimestampToAmPm} from "@/src/utils/timeFormatter";
import type {TaskResponse} from "@/types/task.types";

import toCapitalizeText from "@/src/utils/toCapitalizeText";
import {CaretUp, ThumbsUp} from "@phosphor-icons/react/dist/ssr";
import styles from "./KanbanTaskCard.module.scss";
import TaskOperate from "@/components/elements/Dashboard/TasksWindow/TaskOperate";
import {useOrganization} from "@/context/OrganizationContext";
import {useFetchOrgRole} from "@/hooks/organization/useFetchOrgRole";
import {useFetchProjectRole} from "@/hooks/project/useFetchProjectRole";
import {useFetchTeamRole} from "@/hooks/team/useFetchTeamRole";
import {OrgRole} from "@/types/org.types";
import {ProjectRole} from "@/types/project.types";

interface KanbanTaskCardProps {
    projectId: string;
    data: TaskResponse;
    updateTasks: Dispatch<SetStateAction<TaskResponse[] | undefined>>; // Зміна назви пропса для унікальності
    setDisableDnD: Dispatch<SetStateAction<boolean>>;
}

export function KanbanTaskCard({data, updateTasks, projectId, setDisableDnD}: KanbanTaskCardProps) {
    const [DndDisabled, setDndDisabled] = useState<boolean>(false);
    const [showCardInfo, setShowCardInfo] = useState<boolean>(false);
    const [windowType, setWindowType] = useState<"create" | "operate" | "edit">("operate");

    const {organizationId} = useOrganization();
    const {organizationRole} = useFetchOrgRole(organizationId);
    const {projectRole} = useFetchProjectRole(data?.projectId);
    const {teamRole} = useFetchTeamRole(data?.teamId, organizationId);

    const hasAccess = teamRole ? true : (organizationRole?.role === OrgRole.ADMIN || organizationRole?.role === OrgRole.OWNER) || projectRole === ProjectRole.MANAGER

    const showModalWindow = () => {
        setShowCardInfo(!showCardInfo);
        setDndDisabled(!DndDisabled);
        setDisableDnD(!DndDisabled);
    }

    const time = data?.updatedAt
        ? formatTimestampToAmPm(data.updatedAt)
        : undefined;
    const returnStatus = () => {
        switch (data?.taskStatus) {
            case "NOT_STARTED":
                return <AsciiElement types="notStarted"/>;
            case "IN_PROGRESS":
                return <AsciiElement types="progress"/>;
            case "COMPLETED":
                return <AsciiElement types="completed"/>;
            case "ON_HOLD":
                return <AsciiElement types="hold"/>;

            default:
                return <AsciiElement types="loading"/>;
        }
    };

    return (
        <>
            <div className={styles["task-kanban"]}
                 onClick={() => hasAccess && showModalWindow()}>
                <div className={styles.topBar}>
                    <div className={styles.author}>
                        <p>
                            <b>Author</b>:
                            <br/>{data.author?.name}
                        </p>
                    </div>
                    <div className={styles.time}>
                        <p>
                            <b>
                                Time
                                <span>:</span>
                            </b>
                            {time}
                        </p>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.title}>
                        <h3>
                            <b>
                                <span>Task:</span>
                            </b>
                            {data.title}
                        </h3>
                    </div>
                    <div className={styles.description}>
                        <p>{data.description}</p>
                    </div>

                    <div className={styles.priority}>
                        <p>
                            <b>Priority:</b> {toCapitalizeText(data.priority as string)}
                        </p>
                    </div>
                </div>
                {hasAccess &&
                    <div className={styles.actions}>
                        <div className={styles.comments}>
                            <p>Complete</p>
                            <ThumbsUp/>
                        </div>
                        <div className={`${styles.comments} ${styles.lastComment}`}>
                            <p>
                                Comments:
                                {data._count.comments ? data._count.comments : 0}
                            </p>
                            <CaretUp/>
                        </div>
                    </div>
                }
                <div className={styles.bottomBar}>
                    <div className={styles.team}>
                        <p>
                            <b>Team:</b> {data.team?.title}
                        </p>
                    </div>
                    <div className={styles.status}>
                        <p>Status: </p> {returnStatus()}
                    </div>
                </div>
            </div>
            {showCardInfo && (
                <TaskOperate
                    type={windowType}
                    switchType={setWindowType}
                    updateTaskList={updateTasks}
                    taskId={data.id}
                    projectId={projectId}
                    data={data}
                    onClose={showModalWindow}
                />
            )}
        </>
    );
}

