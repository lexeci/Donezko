import { useMutation, useQueryClient } from '@tanstack/react-query'

import { timerService } from '@/services/timer.service'

export function useCreateSession() {
	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		mutationKey: ['create new session'],
		mutationFn: () => timerService.createSession(),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['get today session']
			})
		}
	})

	return { mutate, isPending }
}
