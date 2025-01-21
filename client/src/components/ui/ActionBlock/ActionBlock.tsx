import {PropsWithChildren} from "react";

import styles from "./ActionBlock.module.scss";

export default function ActionBlock({children}: PropsWithChildren) {
    return (
        <div className={styles["action-block"]}>
            <div className={styles.title}>
                <h4>Available actions:</h4>
            </div>
            <div
                className={styles.container}>
                {children}
            </div>
        </div>
    )
}