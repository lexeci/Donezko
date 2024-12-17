"use client";

import { Button } from "@/components/index";
import generateKeyComp from "@/src/utils/generateKeyComp";

import LogoutButton from "./LogoutButton";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
	const links = [
		{ link: "/workspace", title: "Dashboard" },
		{ link: "/workspace/organizations", title: "Organizations" },
		{ link: "/workspace/teams", title: "Teams" },
		{ link: "/workspace/projects", title: "Projects" },
		{ link: "/workspace/pomodoro", title: "Pomodoro Timer" },
		{ link: "/workspace/settings", title: "Settings" },
	];

	return (
		<div className={styles.sidebar}>
			<div className={styles.container}>
				<div className={styles["container__links"]}>
					{links.map((item, i) => (
						<Button
							type="link"
							link={item.link}
							fullWidth
							block
							negative
							key={generateKeyComp(`${item.title}__${i}`)}
						>
							{item.title}
						</Button>
					))}
				</div>

				<LogoutButton />
			</div>
		</div>
	);
}
