"use client";

import {Button, Field} from "@/components/index";
import {useCreateOrg} from "@/hooks/organization/useCreateOrg";
import {OrgFormData} from "@/types/org.types";
import {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";

import pageStyles from "@/app/page.module.scss";

export default function OrganizationCreate() {
    const {createOrganization, newOrganization} = useCreateOrg();

    const {register, handleSubmit, setValue, reset} = useForm<OrgFormData>({
        mode: "onChange",
    });

    // Локальний стан для згенерованого joinCode
    const [joinCode, setJoinCode] = useState<string>("");

    // Генерація унікального коду приєднання
    const generateJoinCode = () => {
        const code = Math.random().toString(36).substr(2, 99).toUpperCase(); // Генеруємо код
        setJoinCode(code);
        setValue("joinCode", code); // Автоматично заповнюємо поле форми
    };

    useEffect(() => {
        generateJoinCode();
    }, []);

    const onSubmit: SubmitHandler<OrgFormData> = data => {
        createOrganization(data);
    };

    useEffect(() => {
        newOrganization?.id && reset();
    }, [newOrganization]);

    return (
        <div className={pageStyles["workspace-basic-content-window"]}>
            <div className={pageStyles["workspace-basic-content-window__title"]}>
                <h5>Create your own organization</h5>
            </div>
            <div className={pageStyles["workspace-basic-content-window__text-block"]}>
                <p>Please write the title and description for your organization.</p>
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
                        id="description"
                        label="Description:"
                        placeholder="Enter description"
                        type="text"
                        {...register("description", {
                            maxLength: {value: 500, message: "Description is too long"}, // Валідація на довжину
                        })}
                    />
                    <div className={pageStyles["workspace-basic-content-window__form__container"]}>
                        <Field
                            extra={pageStyles["workspace-basic-content-window__form__join"]}
                            id="joinCode"
                            label="JoinCode:"
                            placeholder="Enter joinCode:"
                            type="text"
                            {...register("joinCode", {
                                required: "JoinCode is required!",
                            })}
                            readOnly
                            value={joinCode}
                        />
                        <div className={pageStyles["workspace-basic-content-window__form__join"]}>
                            <Button
                                type="button"
                                fullWidth
                                block
                                onClick={e => {
                                    e.preventDefault();
                                    generateJoinCode();
                                }}
                            >
                                Generate
                            </Button>
                        </div>
                    </div>
                    <div className={pageStyles["workspace-basic-content-window__form__actions"]}>
                        <Button type="button" block>
                            Create Organization
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
