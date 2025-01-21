import Link from "next/link";
import styles from "./logo.module.scss";

export default function Logo() {
    return (
        <div className={styles.logo}>
            <Link href="/client/public">
                <strong>TPlanner.com</strong>
            </Link>
        </div>
    );
}
