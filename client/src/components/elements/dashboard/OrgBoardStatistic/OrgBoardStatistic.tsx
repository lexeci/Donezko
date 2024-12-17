"use client";

import { StatisticBlock, StatisticItem } from "@/components/index";
import { useFetchOrgs } from "@/src/hooks/organization/useFetchOrgs";
import { Buildings } from "@phosphor-icons/react/dist/ssr";

import styles from "./OrgBoardStatistic.module.scss";

const orgs = [
	{
		link: "/workspace/org/1234",
		title: "Insomnia Organization",
		description: "The organization of insomnia and coffee",
		tasks: 5,
		teams: 29,
	},
	{
		link: "/workspace/org/5678",
		title: "Creative Org",
		description: "The organization of insomnia and coffee",
		tasks: 12,
		teams: 6,
	},
];

function NotFoundElement() {
	return (
		<div className={styles["error-found"]}>
			<div className={styles.title}>
				<h5>You don't have any organizations</h5>
			</div>
			<div className={styles.description}>
				<p>Please join in or create your personal organization</p>
			</div>
		</div>
	);
}

export default function OrgBoardStatistic() {
	const { organizationList, setOrganizationList } = useFetchOrgs();

	return (
		<StatisticBlock
			title="Your Organizations"
			description="Organizations with assigned tasks"
			button={{ title: "Show all", link: "/workspace/organization" }}
		>
			{organizationList ? (
				organizationList?.length > 0 ? (
					organizationList?.map((org, i) => (
						<StatisticItem
							key={i}
							icon={<Buildings size={32} />}
							title={org.title}
							description={org.description}
							subtitle={`Teams: ${org.teams.length} | Tasks: ${org.organizationUsers.length}`}
							link={{ href: org.id, text: "Look -->" }}
						/>
					))
				) : (
					<NotFoundElement />
				)
			) : (
				<NotFoundElement />
			)}
		</StatisticBlock>
	);
}
