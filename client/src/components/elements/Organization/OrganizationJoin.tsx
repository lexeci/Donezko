"use client";

import {Button, Field} from "@/components/index";
import {useJoinOrg} from "@/hooks/organization/useJoinOrg";
import {JoinOrgType} from "@/types/org.types";
import {SetStateAction, useEffect} from "react";
import {SubmitHandler, useForm} from "react-hook-form";

import pageStyles from "@/app/page.module.scss";
import {useOrganization} from "@/context/OrganizationContext";

export default function OrganizationJoin({refetch, setOpen}: {
    refetch?: () => void,
    setOpen?: (value: SetStateAction<boolean>) => void
}) {
    const {saveOrganization} = useOrganization()
    const {joinOrganization, joinedOrganization} = useJoinOrg();

    const {register, handleSubmit, setValue, reset} = useForm<JoinOrgType>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<JoinOrgType> = data => {
        joinOrganization(data);
    };

    useEffect(() => {
        if (joinedOrganization?.id) {
            reset(joinedOrganization);
            joinedOrganization?.organizationId && saveOrganization(joinedOrganization.organizationId);
            refetch && refetch();
            setOpen && setOpen(false)
        }
    }, [joinedOrganization]);

    return (
        <div className={pageStyles["workspace-basic-content-window"]}>
            <div className={pageStyles["workspace-basic-content-window__title"]}>
                <h5>Join to your organization</h5>
            </div>
            <div className={pageStyles["workspace-basic-content-window__text-block"]}>
                <p>
                    Please write the title and join code to connect with organization.
                </p>
            </div>
            <div className={pageStyles["workspace-basic-content-window__operate-window"]}>
                <form
                    className={pageStyles["workspace-basic-content-window__form"]}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Field
                        extra={pageStyles["workspace-basic-content-window__form__fields"]}
                        id="title"
                        label="Title:"
                        placeholder="Enter title:"
                        type="text"
                        {...register("title", {
                            required: "Title is required!",
                        })}
                    />

                    <Field
                        extra={pageStyles["workspace-basic-content-window__form__fields"]}
                        id="joinCode"
                        label="JoinCode:"
                        placeholder="Enter joinCode:"
                        type="text"
                        {...register("joinCode", {
                            required: "JoinCode is required!",
                        })}
                    />
                    <div className={pageStyles["workspace-basic-content-window__form__actions"]}>
                        <Button type="button" block>
                            Accept Join
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
