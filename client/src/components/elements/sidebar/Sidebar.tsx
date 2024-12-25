"use client";

import { Button } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { useFetchOrgRole } from "@/hooks/organization/useFetchOrgRole";
import { OrgRole } from "@/types/org.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
	const { organizationId } = useOrganization(); // Отримуємо organizationId з контексту

	const { organizationRole } = useFetchOrgRole(organizationId);

	// Стейт для лінків

	const baseLinks = [
		{ link: "/workspace", title: "Dashboard" },
		{ link: "/workspace/pomodoro", title: "Pomodoro Timer" },
		{ link: "/workspace/settings", title: "Settings" },
	];

	const additionalLinks = [
		{ link: "/workspace/tasks", title: "Tasks" },
		{ link: "/workspace/teams", title: "Teams" },
		{ link: "/workspace/projects", title: "Projects" },
	];

	const [links, setLinks] = useState(baseLinks);

	useEffect(() => {
		const isViewer = organizationRole?.role === OrgRole.VIEWER;
		let updatedLinks = [...baseLinks];

		if (organizationId) {
			// Додаємо посилання на організацію після Dashboard
			updatedLinks.splice(1, 0, {
				link: `/workspace/organizations/${organizationId}`,
				title: "My Organization",
			});

			if (!isViewer) {
				// Вставляємо additionalLinks між Pomodoro та Settings
				const pomodoroIndex = updatedLinks.findIndex(
					link => link.title === "Pomodoro Timer"
				);
				updatedLinks.splice(pomodoroIndex + 1, 0, ...additionalLinks);
			}
		} else {
			// Додаємо Organizations для користувачів без організації
			updatedLinks.splice(1, 0, {
				link: "/workspace/organizations",
				title: "Organizations",
			});
		}

		setLinks(updatedLinks);
	}, [organizationId, organizationRole]); // Залежність від organizationId та organizationRole

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
