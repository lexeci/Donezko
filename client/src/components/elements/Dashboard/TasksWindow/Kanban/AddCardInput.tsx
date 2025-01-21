import {useState, type Dispatch, type SetStateAction} from "react";

import type {TaskResponse} from "@/types/task.types";
import TaskOperate from "../TaskOperate";

import styles from "./KanbanTaskCard.module.scss";

interface AddCardInputProps {
    filterDate?: string;
    updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
    projectId: string;
}

export function AddCardInput(
    {
        updateTaskList,
        filterDate,
        projectId,
    }: AddCardInputProps) {
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    return (
        <div className="mt-5">
            <button
                onClick={() => setShowCreateModal(true)}
                className={styles["add-button"]}
            >
                Add task...
            </button>
            {showCreateModal && (
                <TaskOperate
                    type="create"
                    updateTaskList={updateTaskList}
                    filterDate={filterDate}
                    onClose={() => setShowCreateModal(false)}
                    projectId={projectId}
                />
            )}
        </div>
    );
}
