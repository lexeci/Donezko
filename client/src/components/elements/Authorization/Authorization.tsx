"use client";

import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {useCallback, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {toast} from "sonner";

import {AuthForm} from "@/types/auth.types";

import {AnimatedLink, Button, Field} from "@/components/index";
import {authService} from "@/services/auth.service";

import {DASHBOARD_PAGES} from "@/src/pages-url.config";
import {Minus, Square, X} from "@phosphor-icons/react";
import styles from "./Authorization.module.scss";
import pageStyles from "@/app/page.module.scss";
import {useOrganization} from "@/context/OrganizationContext";

export default function Authorization() {
    const {saveOrganization} = useOrganization();
    const {register, handleSubmit, reset} = useForm<AuthForm>({
        mode: "onChange",
    });

    const [formType, setFormType] = useState<"login" | "register">("login"); // Замінили булеве значення на явний тип

    const {push} = useRouter();

    // Використовуємо useCallback для оптимізації
    const {mutate} = useMutation({
        mutationKey: ["auth"],
        mutationFn: useCallback(
            (data: AuthForm) => authService.main(formType, data),
            [formType]
        ),
        onSuccess: () => {
            toast.success(`Successfully ${formType}ed!`);
            reset();
            push(DASHBOARD_PAGES.HOME);
        },
    });

    const onSubmit: SubmitHandler<AuthForm> = data => {
        saveOrganization(null)
        mutate(data);
    };

    // Додано кастомний хедер, який змінюється відповідно до типу форми
    const renderHeader = () => {
        return formType === "login" ? "Login" : "Register";
    };

    return (
        <div className={styles.authorization}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h4>Login application</h4>
                </div>
                <div className={styles.actions}>
                    <div>
                        <Minus size={8}/>
                    </div>
                    <div>
                        <Square size={8}/>
                    </div>
                    <div>
                        <X size={8}/>
                    </div>
                </div>
            </div>
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={styles.register}>
                    <AnimatedLink
                        type="button"
                        title={
                            formType == "login" ? "Register me!" : "I already have account"
                        }
                        link={"#"}
                        onClick={() =>
                            setFormType(formType == "login" ? "register" : "login")
                        }
                    />
                </div>
                <h1 className={styles.content}>
                    {renderHeader()}
                </h1>
                <Field
                    extra={pageStyles["fields-default"]}
                    id="email"
                    label="Email:"
                    placeholder="Enter email:"
                    type="email"
                    {...register("email", {
                        required: "Email is required!",
                    })}
                />
                {formType == "register" && (
                    <>
                        <Field
                            extra={pageStyles["fields-default"]}
                            id="name"
                            label="Name:"
                            placeholder="Enter name:"
                            type="text"
                            {...register("name", {
                                required: "Name is required!",
                            })}
                        />
                        <Field
                            extra={pageStyles["fields-default"]}
                            id="city"
                            label="City:"
                            placeholder="Enter your city:"
                            type="text"
                            {...register("city", {
                                required: "City is required!",
                            })}
                        />
                    </>
                )}
                <Field
                    extra={pageStyles["fields-default"]}
                    id="password"
                    label="Password: "
                    placeholder="Enter password: "
                    type="password"
                    {...register("password", {
                        required: "Password is required!",
                    })}
                />
                <div className={styles["action-btn"]}>
                    {formType == "login" ? (
                        <Button type="button" block onClick={() => setFormType("login")}>
                            Login
                        </Button>
                    ) : (
                        <Button type="button" block onClick={() => setFormType("register")}>
                            Register
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
