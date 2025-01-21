import {TaskResponse} from "@/types/task.types";
import {Dispatch, SetStateAction} from "react";
import {formatDateToDayMonthYear} from "@/utils/timeFormatter";
import {NotFoundId} from "@/components/index";
import {Cat, GitBranch, ThumbsUp, Trash, UsersThree} from "@phosphor-icons/react/dist/ssr";
import {Alarm, Eye, FlagPennant, ThumbsDown} from "@phosphor-icons/react";
import {useOrganization} from "@/context/OrganizationContext";
import {useFetchOrgRole} from "@/hooks/organization/useFetchOrgRole";
import {OrgRole} from "@/types/org.types";
import {useFetchProjectRole} from "@/hooks/project/useFetchProjectRole";
import {ProjectRole} from "@/types/project.types";
import {useUpdateTask} from "@/hooks/tasks/useUpdateTask";
import {useDeleteTask} from "@/hooks/tasks/useDeleteTask";
import {useFetchTeamRole} from "@/hooks/team/useFetchTeamRole";
import {TeamRole} from "@/types/team.types";

import clsx from "clsx";
import pageStyles from "@/app/page.module.scss";
import styles from "./TaskInfo.module.scss"

interface TaskInfo {
    data?: TaskResponse;
    switchType?: Dispatch<SetStateAction<"create" | "edit" | "operate">>;
    updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
    onClose: () => void;
}

export default function TaskInfo({data, switchType, updateTaskList, onClose}: TaskInfo) {
    const {organizationId} = useOrganization();
    const {organizationRole} = useFetchOrgRole(organizationId);
    const {projectRole} = useFetchProjectRole(data?.projectId);
    const {teamRole} = useFetchTeamRole(data?.teamId, organizationId);

    const hasAccess = (organizationRole?.role === OrgRole.ADMIN || organizationRole?.role === OrgRole.OWNER) || projectRole === ProjectRole.MANAGER

    const {modifyTask} = useUpdateTask();
    const {removeTask} = useDeleteTask();

    const handleUpdateCard = (data?: TaskResponse) => {
        if (data) {
            updateTaskList(previousTasks => {
                return previousTasks ? previousTasks.filter((item) =>
                    item.id === data.id ? data : item
                ) : previousTasks;
            });
        }
    };

    const handleRemoveCard = (data?: TaskResponse) => {
        if (data) {
            updateTaskList(previousTasks => {
                return previousTasks ? previousTasks.filter((item) =>
                    item.id !== data.id && item
                ) : previousTasks;
            });
        }
    };

    const handleCompleteTask = () => {
        organizationId && data && modifyTask({
            taskId: data.id,
            data: {
                organizationId: organizationId,
                isCompleted: !data.isCompleted
            }
        }, {
            onSuccess(data) {
                data && handleUpdateCard(data);
            },
        })
    }

    const handleDeleteTask = () => {
        organizationId && data && removeTask({taskId: data.id, organizationId},
            {
                onSuccess() {
                    handleRemoveCard(data);
                    onClose();
                }
                ,
            }
        )
    }

    const isMember = teamRole?.role === TeamRole.MEMBER || teamRole?.role === TeamRole.LEADER

    return (data ?
            <div className={styles["task-info"]}>
                <div
                    className={styles.actions}>
                    {hasAccess ? (
                        <div
                            className={styles["actions__btn"]}
                            onClick={() => handleCompleteTask()}
                        >
                            <p>{!data.isCompleted ? "Complete" : "Not complete"}</p>
                            {!data.isCompleted ? <ThumbsUp size={16}/> : <ThumbsDown size={16}/>}
                        </div>
                    ) : isMember && (
                        <div
                            className={styles["actions__btn"]}
                            onClick={() => handleCompleteTask()}
                        >
                            <p>{!data.isCompleted ? "Complete" : "Not complete"}</p>
                            {!data.isCompleted ? <ThumbsUp size={16}/> : <ThumbsDown size={16}/>}
                        </div>
                    )
                    }
                    {hasAccess &&
                        <p
                            className={styles["actions__btn"]}
                            onClick={() => switchType && switchType("edit")}>Edit this</p>
                    }
                </div>
                <div className={styles.container}>
                    <div
                        className={styles["author-info"]}>
                        <p>Author: <span>{data.author?.name}</span></p>
                        <Cat size={22}/>
                    </div>
                    <div
                        className={styles["assign-info"]}>
                        <div className={styles["assign-info__item"]}>
                            <p>Task status: <span>{data.taskStatus || "No Status"}</span></p>
                            <FlagPennant size={22}/>
                        </div>
                        <div className={styles["assign-info__item"]}>
                            <p>Priority: <span>{data.priority || "No Priority"}</span></p>
                            <Alarm size={22}/>
                        </div>
                    </div>
                    <div
                        className={styles["assign-info"]}>
                        <div className={styles["assign-info__item"]}>
                            <p>Project: <span>{data.project?.title || "No Project"}</span></p>
                            <GitBranch size={22}/>
                        </div>
                        <div className={styles["assign-info__item"]}>
                            <p>Team: <span>{data.team?.title || "No Team"}</span></p>
                            <UsersThree size={22}/>
                        </div>
                        <div className={styles["assign-info__item"]}>
                            <p>Assignee: <span>{data.user?.name || "No assignee"}</span></p>
                            <Eye size={22}/>
                        </div>
                    </div>
                    <div
                        className={styles["task-info-details"]}>
                        <div className={styles["task-info-details__title"]}>
                            <h4>Title: <span>{data.title}</span></h4>
                        </div>
                        <div className={styles["task-info-details__description"]}>
                            <p className={styles["task-info-details__description__title"]}>Description: </p>
                            <p>{data.description}</p>
                        </div>
                    </div>
                    {(data.createdAt || data.updatedAt) && (
                        <div
                            className={styles["date-info"]}>
                            {data.createdAt &&
                                <p>Created at: {formatDateToDayMonthYear(data.createdAt as Date)}</p>}
                            {data.updatedAt &&
                                <p>Updated since: {formatDateToDayMonthYear(data.updatedAt as Date)}</p>}
                        </div>)}
                </div>
                {hasAccess &&
                    <div
                        className={styles.actions}>
                        <p>Do you want to delete a task {"-->"}</p>
                        <div onClick={() => handleDeleteTask()}>
                            <p>Delete</p>
                            <Trash size={16}/>
                        </div>
                    </div>
                }
            </div>
            :
            <NotFoundId elementTitle={"Task"}/>
    )
}