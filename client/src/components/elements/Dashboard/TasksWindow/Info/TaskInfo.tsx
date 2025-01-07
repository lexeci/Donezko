import {TaskResponse} from "@/types/task.types";
import {Dispatch, SetStateAction} from "react";
import {formatDateToDayMonthYear} from "@/utils/timeFormatter";
import NotFoundId from "../../../NotFoundId/NotFoundId";
import {Cat, GitBranch, ThumbsUp, Trash, UsersThree} from "@phosphor-icons/react/dist/ssr";
import {Alarm, Eye, FlagPennant, ThumbsDown} from "@phosphor-icons/react";
import {useOrganization} from "@/context/OrganizationContext";
import {useFetchOrgRole} from "@/hooks/organization/useFetchOrgRole";
import {OrgRole} from "@/types/org.types";
import {useFetchProjectRole} from "@/hooks/project/useFetchProjectRole";
import {ProjectRole} from "@/types/project.types";
import {useModifyTask} from "@/hooks/tasks/useModifyTask";
import {useTaskRemoval} from "@/hooks/tasks/useTaskRemoval";

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

    const hasAccess = (organizationRole?.role === OrgRole.ADMIN || organizationRole?.role === OrgRole.OWNER) || projectRole === ProjectRole.MANAGER

    const {modifyTask} = useModifyTask();
    const {removeTask} = useTaskRemoval();

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

    return (data ?
            <div className="task-info flex flex-col justify-start items-start w-full gap-y-2 h-full">
                <div
                    className="actions flex flex-row justify-between items-center w-full border-b border-foreground pb-2 cursor-pointer">
                    <div
                        className="flex flex-row items-center gap-x-2 font-semibold border border-foreground p-2 py-1 hover:bg-foreground hover:text-hoverFill transition-all ease-in duration-300"
                        onClick={() => handleCompleteTask()}
                    >
                        <p>{!data.isCompleted ? "Complete" : "Not complete"}</p>
                        {!data.isCompleted ? <ThumbsUp size={16}/> : <ThumbsDown size={16}/>}
                    </div>
                    {hasAccess &&
                        <p className="flex flex-row items-center gap-x-2 font-semibold border border-foreground p-2 py-1 hover:bg-foreground hover:text-hoverFill transition-all ease-in duration-300"
                           onClick={() => switchType && switchType("edit")}>Edit this</p>
                    }
                </div>
                <div className="container flex flex-col justify-start items-start w-full h-full gap-y-2">
                    <div
                        className="author-info flex flex-row justify-between items-center border border-foreground w-full py-2 px-4 text-xs">
                        <p>Author: <span className="font-semibold">{data.author?.name}</span></p>
                        <Cat size={22}/>
                    </div>
                    <div
                        className="assign-info flex flex-col border border-foreground w-full py-2 px-4 text-xs">
                        <div className="flex flex-row justify-between items-center w-full">
                            <p>Task status: <span
                                className="font-semibold lowercase">{data.taskStatus || "No Status"}</span></p>
                            <FlagPennant size={22}/>
                        </div>
                        <div className="flex flex-row justify-between items-center w-full">
                            <p>Priority: <span
                                className="font-semibold lowercase">{data.priority || "No Priority"}</span></p>
                            <Alarm size={22}/>
                        </div>
                    </div>
                    <div
                        className="assign-info flex flex-col border border-foreground w-full py-2 px-4 text-xs">
                        <div className="flex flex-row justify-between items-center w-full">
                            <p>Project: <span className="font-semibold">{data.project?.title || "No Project"}</span></p>
                            <GitBranch size={22}/>
                        </div>
                        <div className="flex flex-row justify-between items-center w-full">
                            <p>Team: <span className="font-semibold">{data.team?.title || "No Team"}</span></p>
                            <UsersThree size={22}/>
                        </div>
                        <div className="flex flex-row justify-between items-center w-full">
                            <p>Assignee: <span className="font-semibold">{data.user?.name || "No assignee"}</span></p>
                            <Eye size={22}/>
                        </div>
                    </div>
                    <div
                        className="task-info flex flex-col justify-start items-start border border-foreground w-full h-full py-4 px-4">
                        <div className="title text-xl pb-2">
                            <h4>Title: <span className="font-semibold">{data.title}</span></h4>
                        </div>
                        <div className="description border-t border-foreground w-full pt-4">
                            <p className="font-semibold mb-1.5">Description: </p>
                            <p>{data.description}</p>
                        </div>
                    </div>
                    {(data.createdAt || data.updatedAt) && (
                        <div
                            className="date-info text-xs flex flex-col justify-center items-start border border-foreground w-full py-2 px-4">
                            {data.createdAt &&
                                <p>Created at: {formatDateToDayMonthYear(data.createdAt as Date)}</p>}
                            {data.updatedAt &&
                                <p>Updated since: {formatDateToDayMonthYear(data.updatedAt as Date)}</p>}
                        </div>)}
                </div>
                {hasAccess &&
                    <div
                        className="actions flex flex-row justify-between items-center w-full border-t border-foreground py-2 cursor-pointer">
                        <p>Do you want to delete a task {"-->"}</p>
                        <div onClick={() => handleDeleteTask()}
                             className="flex flex-row items-center gap-x-2 font-semibold border border-foreground p-2 py-1 hover:bg-foreground hover:text-hoverFill transition-all ease-in duration-300">
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