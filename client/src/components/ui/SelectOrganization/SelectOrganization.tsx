"use client";

import {useOrganization} from "@/context/OrganizationContext";
import {useFetchOrgs} from "@/hooks/organization/useFetchOrgs";
import {Plus} from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx"; // Імпортуємо clsx для умовних класів
import {useEffect, useState} from "react";
import {OrganizationModal} from "../../elements";

import styles from "./SelectOrganization.module.scss";

export default function SelectOrganization() {
    const {organizationId, saveOrganization} = useOrganization(); // Отримуємо organizationId з контексту
    const {organizationList, handleRefetch} = useFetchOrgs();

    const [isOpen, setIsOpen] = useState(false); // Стейт для контролю відкриття списку
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [selectedOrg, setSelectedOrg] = useState<string | null>(organizationId); // Зберігаємо вибрану організацію

    const handleSelectOrganization = (orgId: string) => {
        setSelectedOrg(orgId);
        saveOrganization(orgId); // Зберігаємо вибрану організацію в контексті
        setIsOpen(false); // Закриваємо список після вибору організації
    };

    useEffect(() => {
        if (organizationId) {
            // Пошук поточної організації за ID
            const currentOrganization = organizationList?.find(
                org => org.organization.id === organizationId
            );
            currentOrganization &&
            setSelectedOrg(currentOrganization.organization.id);
        } else {
            setSelectedOrg(null);
        }
    }, [organizationId]);

    return (
        <div className={styles["selected-org"]}>
            {openModal && <OrganizationModal setOpen={setOpenModal} refetch={handleRefetch}/>}
            {/* Вибір організації або інформація про вибрану */}
            {selectedOrg ? (
                <div
                    className={styles["selected-org__btn"]}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>Selected: </span>
                    <span className={styles["selected-org__name"]}>
						{
                            organizationList?.find(org => org.organization.id === selectedOrg)
                                ?.organization.title
                        }
					</span>
                </div>
            ) : (
                <div
                    className={styles["not-selected-org"]}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={styles["not-selected-org__title"]}>Select Organization</span>
                </div>
            )}

            {/* Список організацій */}
            {isOpen && (
                <div
                    className={styles["org-list"]}>
                    <div
                        className={styles["org-list__manage-org"]}>
                        <div className={styles["org-list__manage-org__title"]}>
                            <h5>Actions:</h5>
                        </div>
                        <div
                            className={styles["org-list__manage-org__item"]}
                            onClick={() => setOpenModal(true)}
                        >
                            <Plus size={12} className="mr-2"/> Organization
                        </div>
                    </div>

                    <div className={styles["org-list__container"]}>
                        {organizationList?.map(org => {
                            const isSelected = selectedOrg === org.organization.id; // Перевірка, чи вибрана організація
                            return (
                                <div
                                    key={org.organization.id}
                                    className={clsx(
                                        styles["org-list__container__item"],
                                        isSelected && styles["org-list__container__item__selected"],
                                        !isSelected && styles["org-list__container__item__not-selected"]
                                    )}
                                    onClick={() =>
                                        !isSelected && handleSelectOrganization(org.organization.id)
                                    }
                                >
                                    <div className={styles["org-list__container__item__container"]}>
                                        <div
                                            className={styles["org-list__container__item__details"]}>
                                            {`Organization: ${org.organization.title}`}
                                        </div>
                                        <div className={styles["org-list__container__item__details"]}>
                                            {`Members: ${
                                                org.organization._count?.organizationUsers || 0
                                            } / Projects: ${org.organization._count?.projects}`}
                                        </div>
                                        <div className={styles["org-list__container__item__details"]}>
                                            {`Role: ${org.role || "N/A"}`}
                                        </div>
                                        <div className={styles["org-list__container__item__status"]}>
                                            {`Status: ${org.organizationStatus || "Inactive"}`}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
