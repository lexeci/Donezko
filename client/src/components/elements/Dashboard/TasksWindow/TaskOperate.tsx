import {TaskResponse} from "@/types/task.types";
import {Dispatch, SetStateAction} from "react";
import {Comments, ModalWindow} from "@/components/index";
import TaskCreate from "./Operate/TaskCreate";
import TaskUpdate from "./Operate/TaskUpdate";
import TaskCreateInfo from "./Info/TaskCreateInfo";
import TaskUpdateInfo from "./Info/TaskUpdateInfo";
import TaskInfo from "@/components/elements/Dashboard/TasksWindow/Info/TaskInfo";

interface TaskOperate {
    updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
    filterDate?: string | undefined;
    onClose: () => void;
    type: "create" | "edit" | "operate";
    switchType?: Dispatch<SetStateAction<"create" | "edit" | "operate">>;
    projectId?: string;
    taskId?: string
    data?: TaskResponse;
}

export default function TaskOperate({
                                        type,
                                        filterDate,
                                        onClose,
                                        updateTaskList,
                                        projectId,
                                        taskId,
                                        data,
                                        switchType
                                    }: TaskOperate) {
    const returnLeftElement = () => {
        switch (type) {
            case "create":
                return (
                    <TaskCreate
                        filterDate={filterDate}
                        updateTaskList={updateTaskList}
                        projectId={projectId}
                    />
                );

            case "edit":
                return (
                    <TaskUpdate
                        updateTaskList={updateTaskList}
                        taskId={taskId}
                        projectId={projectId}
                        switchType={switchType}
                        data={data}
                    />
                );

            case "operate":
                return <TaskInfo
                    data={data}
                    switchType={switchType}
                    updateTaskList={updateTaskList}
                    onClose={onClose}
                />;

            default:
                return <></>;
        }
    };
    const returnRightElement = () => {
        switch (type) {
            case "create":
                return (
                    <TaskCreateInfo/>
                );

            case "edit":
                return (
                    <TaskUpdateInfo/>
                );

            case "operate":
                return <Comments taskId={taskId}/>;

            default:
                return <p>Seems lonely there...</p>;
        }
    };

    return (
        <ModalWindow
            title="Task manager.exe"
            subtitle="Manage your task straight away"
            onClose={onClose}
        >
            <div
                className="container bg-background grid grid-cols-2 grid-rows-1 p-0.5 gap-x-0.5 w-full h-full border border-foreground whitespace-break-spaces">
                <div className="task-info p-4 border border-foreground overflow-y-auto h-full">
                    {returnLeftElement()}
                </div>
                <div className="add-info border border-foreground overflow-y-auto h-full">
                    {returnRightElement()}
                </div>
            </div>
        </ModalWindow>
    );
}
