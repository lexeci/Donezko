import {useMutation, useQueryClient} from "@tanstack/react-query";

import {TaskFormData, TaskResponse} from "@/types/task.types";

import {taskService} from "@/src/services/task.service";
import {toast} from "sonner";
import {useState} from "react";

export function useUpdateTask() {
    // Зміна назви функції для унікальності
    const [updatedTask, setUpdatedTask] = useState<TaskResponse | undefined>(
        undefined
    );

    const {mutate: modifyTask, isPending} = useMutation({
        mutationKey: ["update task"], // Зміна назви ключа для унікальності
        mutationFn: (
            {taskId, data}: { taskId: string; data: TaskFormData } // Зміна назви параметрів
        ) => taskService.updateTask(taskId, data),
        onSuccess(data) {
            toast.success('Successfully updated task!');
            setUpdatedTask(data)
        },
    });

    return {modifyTask, updatedTask, isPending}; // Зміна назви функції, що повертається
}
