import { useMutation, useQueryClient } from '@tanstack/react-query';

import { taskService } from '@/services/task.service'; // Залишаємо без змін, якщо це необхідно

export function useTaskRemoval() { // Зміна назви хуку для унікальності
	const queryClient = useQueryClient();

	const { mutate: removeTask, isPending: isRemovalPending } = useMutation({ // Зміна назви функції та статусу
		mutationKey: ['delete task'], // Зміна ключа мутації для унікальності
		mutationFn: (taskId: string) => taskService.deleteTask(taskId), // Залишаємо назву сервісу
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['tasks']
			}) // Зміна ключа запиту для унікальності
		}
	});

	return { removeTask, isRemovalPending }; // Повертаємо оновлену назву функції та статусу
}
