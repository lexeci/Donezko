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
	const [links, setLinks] = useState([
		{ link: "/workspace", title: "Dashboard" },
		{ link: "/workspace/pomodoro", title: "Pomodoro Timer" },
		{ link: "/workspace/settings", title: "Settings" },
	]);

	useEffect(() => {
		const isViewer = organizationRole
			? organizationRole.role === OrgRole.VIEWER
			: true;

		// Оновлюємо список лінків при зміні organizationId
		if (organizationId) {
			if (isViewer === false) {
				setLinks([
					{ link: "/workspace", title: "Dashboard" },
					{
						link: `/workspace/organizations/${organizationId}`,
						title: "My Organization",
					},
					{ link: "/workspace/teams", title: "Teams" },
					{ link: "/workspace/projects", title: "Projects" },
					{ link: "/workspace/pomodoro", title: "Pomodoro Timer" },
					{ link: "/workspace/settings", title: "Settings" },
				]);
			} else {
				setLinks([
					{ link: "/workspace", title: "Dashboard" },
					{
						link: `/workspace/organizations/${organizationId}`,
						title: "My Organization",
					},
					{ link: "/workspace/pomodoro", title: "Pomodoro Timer" },
					{ link: "/workspace/settings", title: "Settings" },
				]);
			}
		} else {
			setLinks([
				{ link: "/workspace", title: "Dashboard" },
				{ link: "/workspace/organizations", title: "Organizations" },
				{ link: "/workspace/pomodoro", title: "Pomodoro Timer" },
				{ link: "/workspace/settings", title: "Settings" },
			]);
		}
	}, [organizationId, organizationRole]); // Залежність від organizationId

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
