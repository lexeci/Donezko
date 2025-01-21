import {useState} from "react";
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {toast} from 'sonner'

import {UserFormType} from '@/types/auth.types'
import {userService} from '@/services/user.service'

export function useUpdateUser() {
    const queryClient = useQueryClient()
    const [updatedUser, setUpdatedUser] = useState<any | undefined>(
        undefined
    );

    const {mutate, isPending} = useMutation({
        mutationKey: ['update profile'],
        mutationFn: (data: UserFormType) => userService.update(data),
        onSuccess(data) {
            toast.success('Successfully update profile!');
            setUpdatedUser(data)
        }
    })

    return {mutate, updatedUser, isPending}
}
