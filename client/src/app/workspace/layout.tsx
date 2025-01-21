"use client";

import {NoConnection, NoOrganization, Sidebar} from "@/components/index";
import {useOrganization} from "@/context/OrganizationContext";
import {CoinVertical} from "@phosphor-icons/react";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {useNetworkStatus} from "@/hooks/useNetworkStatus";

import styles from "./layout.module.scss";
import pageStyles from "@/app/page.module.scss";

export default function Layout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
    const isOnline = useNetworkStatus();

    const {organizationId} = useOrganization(); // Отримуємо organizationId з контексту

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (organizationId !== undefined) {
            setIsLoading(false);
        }
    }, [organizationId]);

    const isSelected = organizationId !== null;

    const pathname = usePathname();

    return isOnline ? (
        <div
            className={pageStyles["workspace-base"]}>
            <Sidebar/>
            <div
                className={pageStyles["content-base"]}
            >
                {isLoading ? (
                    <div className={pageStyles["workspace-not-loaded-coin"]}>
                        <CoinVertical size={80}/>
                    </div>
                ) : isSelected || pathname === "/workspace/organizations" ? (
                    <div className={styles["selected-content"]}>{children}</div>
                ) : (
                    <NoOrganization/>
                )}
            </div>
        </div>
    ) : (
        <NoConnection/>
    );
}
