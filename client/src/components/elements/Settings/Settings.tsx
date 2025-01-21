'use client';

import pageStyles from "@/app/page.module.scss";
import styles from "./Settings.module.scss";

import {useUpdateUser} from "@/hooks/user/useUpdateUser";
import {useInitialUserData} from "@/hooks/user/useInitialUserData";
import {SubmitHandler, useForm} from "react-hook-form";
import {UserFormType} from "@/types/auth.types";
import {Button, Field} from "@/components/index";
import {useState} from "react";
import {CoinVertical} from "@phosphor-icons/react/dist/ssr";

export default function Settings() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {register, handleSubmit, reset} = useForm<UserFormType>({
        mode: 'onChange'
    })

    useInitialUserData(reset, setIsLoading)

    const {isPending, mutate} = useUpdateUser()

    const onSubmit: SubmitHandler<UserFormType> = data => {
        const {password, ...rest} = data

        mutate({
            ...rest,
            password: password || undefined
        })
    }


    return !isLoading ? (<div
            className={pageStyles["workspace-content-center"]}
        >
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={styles.container}>
                    <div>
                        <Field
                            id='email'
                            label='Email: '
                            placeholder='Enter email: '
                            type='email'
                            {...register('email', {
                                required: 'Email is required!'
                            })}
                            extra={styles.fields}
                        />

                        <Field
                            id='name'
                            label='Name: '
                            placeholder='Enter name: '
                            {...register('name')}
                            extra={styles.fields}
                        />

                        <Field
                            id='city'
                            label='City: '
                            placeholder='Enter city: '
                            {...register('city')}
                            extra={styles.fields}
                        />

                        <Field
                            id='password'
                            label='Password: '
                            placeholder='Enter password: '
                            type='password'
                            {...register('password')}
                            extra={styles["fields__last"]}
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
                            extra={styles.fields}
                        />

                        <Field
                            id='breakInterval'
                            label='Break interval (min.): '
                            placeholder='Enter break interval (min.): '
                            isNumber
                            {...register('breakInterval', {
                                valueAsNumber: true
                            })}
                            extra={styles.fields}
                        />

                        <Field
                            id='intervalsCount'
                            label='Intervals count (max 10): '
                            placeholder='Enter intervals count (max 10): '
                            isNumber
                            {...register('intervalsCount', {
                                valueAsNumber: true
                            })}
                            extra={styles["fields__lasting"]}
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
        : (
            <div className={pageStyles["workspace-not-loaded-coin"]}>
                <CoinVertical size={80}/>
            </div>
        )
}