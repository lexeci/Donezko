import {PropsWithChildren} from "react";
import styles from "./PageLayout.module.scss";

export default function PageLayout({children}: PropsWithChildren) {
    return (
        <div className={styles.page}>
            {children}
        </div>
    );
}
