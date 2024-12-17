import { Button } from "@/components/index";
import styles from "./HeaderUserBadge.module.scss";

export default function HeaderUserBadge() {
	return (
		<div className={styles["user-badge"]} aria-label="User Badge">
			<Button type="link" link="#" block>
				Login
			</Button>
		</div>
	);
}
