"use client";

import {Button, Field, Select} from "@/components/index";
import {useFetchOrgs} from "@/hooks/organization/useFetchOrgs";
import {useFetchOrgUsers} from "@/hooks/organization/useFetchOrgUsers";
import {useCreateTeam} from "@/hooks/team/useCreateTeam";
import {OrgResponse} from "@/types/org.types";
import {TeamFormData, TeamsResponse} from "@/types/team.types";
import {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import pageStyles from "@/app/page.module.scss";

export default function TeamCreate(
    {
        organizationId: localOrgId,
        organizationTitle: localOrgTitle,
        setTeams,
    }: {
        organizationId?: string | null;
        organizationTitle?: string;
        setTeams: (newTeam: TeamsResponse) => void;
    }) {
    const [organizations, setOrganizations] = useState<OrgResponse[]>();
    const [organizationId, setOrganizationId] = useState<string | undefined>();
    const {organizationList} = useFetchOrgs(); // Отримуємо список організацій
    const {createTeam, newTeam} = useCreateTeam();
    const {organizationUserList} = useFetchOrgUsers({
        organizationId,
        hideFromTeam: true,
    });

    const {register, handleSubmit, reset, setValue} = useForm<TeamFormData>({
        mode: "onChange",
    });

    // Хендлер для вибору організації
    const handleUserSelect = (value: string) => {
        setValue("teamLeaderId", value); // Встановлюємо це значення в форму
    };

    const onSubmit: SubmitHandler<TeamFormData> = data => {
        createTeam(data); // Створюємо команду
    };

    useEffect(() => {
        localOrgId && setOrganizationId(localOrgId);
        localOrgId
            ? setValue("organizationId", localOrgId)
            : setOrganizationId(organizationId);
    }, [localOrgId, organizationId]);

    useEffect(() => {
        if (organizationList) {
            setOrganizations(organizationList); // Оновлюємо список організацій
        }
    }, [organizationList]);

    // Скидання форми після створення нової команди
    useEffect(() => {
        if (newTeam?.id) {
            reset(); // Скидаємо форму після успішного створення команди
            setValue("organizationId", organizationId);
            setTeams && setTeams(newTeam);
        }
    }, [newTeam]);

    return (
        <div className={pageStyles["workspace-basic-content-window"]}>
            <div className={pageStyles["workspace-basic-content-window__title"]}>
                <h5>Create your own team</h5>
            </div>
            <div className={pageStyles["workspace-basic-content-window__text-block"]}>
                <p>Please write the title and description for your team.</p>
            </div>
            <div className={pageStyles["workspace-basic-content-window__operate-window"]}>
                {organizations && organizationUserList?.length > 0 ? (
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
                            id="description"
                            label="Description:"
                            placeholder="Enter description"
                            type="text"
                            {...register("description", {
                                maxLength: {value: 500, message: "Description is too long"},
                            })}
                        />
                        {organizationUserList && (
                            <Select
                                extra={pageStyles["workspace-basic-content-window__form__fields"]}
                                id="leader-select"
                                label="Select Leader:"
                                placeholder="Choose a leader"
                                options={organizationUserList.map(item => ({
                                    value: item.userId,
                                    label: item.user.name,
                                }))}
                                onChange={e => handleUserSelect(e.target.value)} // Оновлення організації
                            />
                        )}

                        {/* Кнопка для створення команди */}
                        <div className={pageStyles["workspace-basic-content-window__form__actions"]}>
                            <Button type="button" block disabled={!organizationId}>
                                Create Team
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className={pageStyles["workspace-basic-content-window__text-block"]}>
                        <p>You cannot create a team due lack of members</p>
                    </div>
                )}
            </div>
        </div>
    );
}
