import {Dispatch, SetStateAction, useEffect} from 'react'
import {UseFormReset} from 'react-hook-form'

import {UserFormType} from '@/types/auth.types'
import {useFetchUserProfile} from "@/hooks/user/useFetchUserProfile";

export function useInitialUserData(reset: UseFormReset<UserFormType>, setIsLoading: Dispatch<SetStateAction<boolean>>) {
    const {profileData: data, isDataLoaded} = useFetchUserProfile()

    useEffect(() => {
        if (isDataLoaded && data) {
            reset({
                email: data.user.email,
                name: data.user.name,
                city: data.user.city,
                breakInterval: data.user.breakInterval,
                intervalsCount: data.user.intervalsCount,
                workInterval: data.user.workInterval
            })
            setIsLoading(false)
        }
    }, [isDataLoaded, data])
}
