import {useMutation, useQueryClient} from "@tanstack/react-query";

import {TaskFormData, TaskResponse} from "@/types/task.types"; // Зміна назви типу для унікальності

import {taskService} from "@/src/services/task.service"; // Залишаємо без змін, якщо це необхідно
import {useState} from "react";
import {toast} from "sonner";

export function useCreateTask() {
    // Зміна назви хуку для унікальності
    const [createdTask, setCreatedTask] = useState<TaskResponse | undefined>(
        undefined
    );

    const {mutate: createTask, isPending} = useMutation({
        // Зміна назви функції для унікальності
        mutationKey: ["Create task"], // Зміна ключа мутації для унікальності
        mutationFn: (data: TaskFormData) => taskService.createTask(data), // Залишаємо назву сервісу
        onSuccess(data) {
            toast.success('Successfully created task!');
            setCreatedTask(data);
        },
    });

    return {createTask, createdTask, isPending}; // Повертаємо оновлену назву функції
}
