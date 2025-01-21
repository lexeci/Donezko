import {AnimatedLink} from "@/components/ui";
import {ReactNode} from "react";

import {Minus, Square, X} from "@phosphor-icons/react/dist/ssr";
import styles from "./EntityItem.module.scss";

interface EntityItem {
    title: string;
    firstStat: string; // Для "Teams" або "Tasks"
    secondaryStat: string; // Для "Teams" або "Tasks"
    icon: ReactNode; // <Buildings /> або <UsersThree />
    linkBase: string;
    onClick?: () => void;
    hideLink?: boolean
}

export default function EntityItem(
    {
        title,
        firstStat,
        secondaryStat,
        icon,
        linkBase,
        onClick,
        hideLink = false,
    }: EntityItem) {
    return (
        <div className={styles.item} onClick={onClick}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h4>{title}</h4>
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
            <div className={styles.icon}>{icon}</div>
            <div className={styles.footer}>
                <div className={styles.statistics}>
                    <p>{firstStat}</p>
                    <p>{secondaryStat}</p>
                </div>
                <div className={styles["show-more"]}>
                    {!hideLink ?
                        <AnimatedLink
                            link={linkBase}
                            title={onClick !== undefined ? "Choose" : "Show more"}
                        /> : <p>You don't have access</p>
                    }
                </div>
            </div>
        </div>
    );
}
