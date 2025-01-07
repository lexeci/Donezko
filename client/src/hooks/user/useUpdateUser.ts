import {useMutation, useQueryClient} from '@tanstack/react-query'
import {toast} from 'sonner'

import {UserFormType} from '@/types/auth.types'

import {userService} from '@/services/user.service'

export function useUpdateUser() {
    const queryClient = useQueryClient()

    const {mutate, isPending} = useMutation({
        mutationKey: ['update profile'],
        mutationFn: (data: UserFormType) => userService.update(data),
        onSuccess() {
            toast.success('Successfully update profile!')
            queryClient.invalidateQueries({queryKey: ['profile']})
        }
    })

    return {mutate, isPending}
}
