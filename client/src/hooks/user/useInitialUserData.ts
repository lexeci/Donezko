import {useEffect} from 'react'
import {UseFormReset} from 'react-hook-form'

import {UserFormType} from '@/types/auth.types'
import {useFetchUserProfile} from "@/hooks/useFetchUserProfile";


export function useInitialUserData(reset: UseFormReset<UserFormType>) {
    const {profileData: data, isDataLoaded} = useFetchUserProfile()

    useEffect(() => {
        if (isDataLoaded && data) {
            reset({
                email: data.user.email,
                name: data.user.name,
                breakInterval: data.user.breakInterval,
                intervalsCount: data.user.intervalsCount,
                workInterval: data.user.workInterval
            })
        }
    }, [isDataLoaded])
}
