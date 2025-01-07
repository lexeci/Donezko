'use client';

import pageStyles from "@/app/page.module.scss";
import {useUpdateUser} from "@/hooks/user/useUpdateUser";
import {useInitialUserData} from "@/hooks/user/useInitialUserData";
import {SubmitHandler, useForm} from "react-hook-form";
import {UserFormType} from "@/types/auth.types";
import {Button, Field} from "@/components/index";

export default function Settings() {
    const {register, handleSubmit, reset} = useForm<UserFormType>({
        mode: 'onChange'
    })

    useInitialUserData(reset)

    const {isPending, mutate} = useUpdateUser()

    const onSubmit: SubmitHandler<UserFormType> = data => {
        const {password, ...rest} = data

        mutate({
            ...rest,
            password: password || undefined
        })
    }


    return (<div
        className={pageStyles["workspace-content-center"]}
    >
        <form
            className='w-1/2 mx-auto'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='grid grid-cols-2 gap-10'>
                <div>
                    <Field
                        id='email'
                        label='Email: '
                        placeholder='Enter email: '
                        type='email'
                        {...register('email', {
                            required: 'Email is required!'
                        })}
                        extra='mb-4'
                    />

                    <Field
                        id='name'
                        label='Name: '
                        placeholder='Enter name: '
                        {...register('name')}
                        extra='mb-4'
                    />

                    <Field
                        id='password'
                        label='Password: '
                        placeholder='Enter password: '
                        type='password'
                        {...register('password')}
                        extra='mb-10'
                    />
                </div>

                <div>
                    <Field
                        id='workInterval'
                        label='Work interval (min.): '
                        placeholder='Enter work interval (min.): '
                        isNumber
                        {...register('workInterval', {
                            valueAsNumber: true
                        })}
                        extra='mb-4'
                    />

                    <Field
                        id='breakInterval'
                        label='Break interval (min.): '
                        placeholder='Enter break interval (min.): '
                        isNumber
                        {...register('breakInterval', {
                            valueAsNumber: true
                        })}
                        extra='mb-4'
                    />

                    <Field
                        id='intervalsCount'
                        label='Intervals count (max 10): '
                        placeholder='Enter intervals count (max 10): '
                        isNumber
                        {...register('intervalsCount', {
                            valueAsNumber: true
                        })}
                        extra='mb-6'
                    />
                </div>
            </div>

            <Button
                type='button'
                disabled={isPending}
                fullWidth
            >
                Save
            </Button>
        </form>
    </div>)
}