import {WindowContainer} from "@/components/index";
import {TaskResponse} from "@/types/task.types";
import {Dispatch, SetStateAction} from "react";
import {KanbanTaskView} from "./Kanban/KanbanTasks";
import clsx from "clsx";

import styles from "./TaskWindow.module.scss";

interface TasksWindow {
    isPage?: boolean;
    taskList?: TaskResponse[];
    setTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
    projectId: string;
    handleRefetch: () => void;
}

export default function TasksWindow(
    {
        isPage,
        taskList,
        setTaskList,
        projectId,
        handleRefetch,
    }: TasksWindow) {
    return !isPage ? (
        <WindowContainer title="Insomnia Project" subtitle="Tasks [99+]" fullPage>
            {true ? (
                <KanbanTaskView
                    taskList={taskList}
                    setTaskList={setTaskList}
                    projectId={projectId}
                    handleRefetch={handleRefetch}
                />
            ) : (
                <></>
            )}
        </WindowContainer>
    ) : (
        <div className={clsx(styles["is-page"], "bg-radial-grid-small")}>
            {true ? (
                <KanbanTaskView
                    taskList={taskList}
                    setTaskList={setTaskList}
                    projectId={projectId}
                    handleRefetch={handleRefetch}
                />
            ) : (
                <></>
            )}
        </div>
    );
}
