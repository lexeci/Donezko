import {Minus, Square, X} from "@phosphor-icons/react/dist/ssr";
import {PropsWithChildren} from "react";

import clsx from "clsx";
import styles from "./WindowContainer.module.scss";

type WindowContainerProps = {
    title: string; // Заголовок контейнера.
    subtitle: string; // Додаткова інформація, наприклад, кількість проектів.
    fullPage?: boolean;
    autoContent?: boolean;
    onClose?: () => void;
};

export default function WindowContainer(
    {
        title,
        subtitle,
        children,
        fullPage = false,
        autoContent = false,
        onClose,
    }: PropsWithChildren<WindowContainerProps>) {
    const currentYear = new Date().getFullYear();
    const credentials = `© TPlanner ${currentYear}. All Rights Reserved by Andriy Neaijko.`

    return (
        <div
            className={clsx(
                styles.window,
                fullPage && styles["full-page"],
                "bg-radial-grid-small"
            )}
        >
            <div className={styles.header}>
                <div className={styles.title}>
                    <h5>{title}</h5>
                    <span>-</span>
                    <p>{subtitle}</p>
                </div>
                <div className={styles.actions}>
                    <div className={styles.item}>
                        <Minus size={16}/>
                    </div>
                    <div className={styles.item}>
                        <Square size={16}/>
                    </div>
                    <div
                        className={clsx(styles.item, onClose && styles.closure)}
                        onClick={onClose}
                    >
                        <X size={16}/>
                    </div>
                </div>
            </div>
            <div
                className={clsx(styles.content, autoContent && styles["content-auto"])}
            >
                {children}
            </div>
            <div className={styles.footer}>
                <h5>{credentials}</h5>
                <p>{"\t(⊙＿⊙')"}</p>
            </div>
        </div>
    );
}
