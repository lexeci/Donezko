"use client";

import {AnimatedLink} from "@/components/index";
import {SetStateAction, useState} from "react";
import ModalWindow from "../ModalWindow/ModalWindow";
import OrganizationCreate from "./OrganizationCreate";
import OrganizationJoin from "./OrganizationJoin";

import styles from "./OrganizationElements.module.scss"

export default function OrganizationModal(
    {
        setOpen,
        refetch,
    }: {
        setOpen: (value: SetStateAction<boolean>) => void;
        refetch?: () => void;
    }) {
    const [formType, setFormType] = useState<"join" | "create">("join");

    return (
        <ModalWindow
            title="Organization manager.exe"
            subtitle="The manager to operate your organization"
            onClose={() => setOpen(false)}
        >
            <div className={styles["modal-switcher"]}>
                <div className={styles.title}>
                    <h5>Please choose your action: </h5>
                </div>
                <AnimatedLink
                    type="button"
                    link="#"
                    title={
                        formType !== "join" ? "I want to join!" : "I want to create my own!"
                    }
                    onClick={() =>
                        formType !== "join" ? setFormType("join") : setFormType("create")
                    }
                />
            </div>
            {formType !== "join" ? <OrganizationCreate/> : <OrganizationJoin refetch={refetch} setOpen={setOpen}/>}
        </ModalWindow>
    );
}
