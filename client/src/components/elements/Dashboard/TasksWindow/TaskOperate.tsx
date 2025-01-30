import {TaskResponse} from "@/types/task.types";
import {Dispatch, SetStateAction} from "react";
import {Comments, ModalWindow} from "@/components/index";
import TaskCreate from "./Operate/TaskCreate";
import TaskUpdate from "./Operate/TaskUpdate";
import TaskCreateInfo from "./Info/TaskCreateInfo";
import TaskUpdateInfo from "./Info/TaskUpdateInfo";
import TaskInfo from "./Info/TaskInfo";

import styles from "./TaskWindow.module.scss";

interface TaskOperate {
    updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
    filterDate?: string | undefined;
    onClose: () => void;
    type: "create" | "edit" | "operate";
    switchType?: Dispatch<SetStateAction<"create" | "edit" | "operate">>;
    projectId?: string;
    taskId?: string
    data?: TaskResponse;
    handleRefetch: () => void;
}

export default function TaskOperate(
    {
        type,
        filterDate,
        onClose,
        updateTaskList,
        projectId,
        taskId,
        data,
        switchType,
        handleRefetch
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
                        handleRefetch={handleRefetch}
                    />
                );

            case "operate":
                return <TaskInfo
                    data={data}
                    switchType={switchType}
                    updateTaskList={updateTaskList}
                    handleRefetch={handleRefetch}
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
                className={styles["task-operate-container"]}>
                <div className={styles["task-operate-container__task-info"]}>
                    {returnLeftElement()}
                </div>
                <div className={styles["task-operate-container__add-info"]}>
                    {returnRightElement()}
                </div>
            </div>
        </ModalWindow>
    );
}
