import {useMutation, useQueryClient} from "@tanstack/react-query";

import {taskService} from "@/src/services/task.service";
import {useState} from "react";
import {toast} from "sonner"; // Залишаємо без змін, якщо це необхідно

export function useDeleteTask() {
    // Зміна назви хуку для унікальності
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    const {mutate: removeTask, isPending} = useMutation({
        // Зміна назви функції та статусу
        mutationKey: ["delete task"], // Зміна ключа мутації для унікальності
        mutationFn: ({taskId, organizationId}: { taskId: string, organizationId: string }) => taskService.deleteTask({
            taskId,
            organizationId
        }), // Залишаємо назву сервісу
        onSuccess(data) {
            toast.success('Successfully deleted task!');
            setIsDeleted(data)
        },
    });

    return {removeTask, isDeleted, isPending}; // Повертаємо оновлену назву функції та статусу
}
