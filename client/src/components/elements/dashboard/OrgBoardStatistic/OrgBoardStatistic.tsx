"use client";

import { StatisticBlock, StatisticItem } from "@/components/index";
import { useFetchOrgs } from "@/src/hooks/organization/useFetchOrgs";
import generateKeyComp from "@/src/utils/generateKeyComp";
import { Buildings } from "@phosphor-icons/react/dist/ssr";

import styles from "./OrgBoardStatistic.module.scss";

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
					organizationList?.map((item, i) => {
						const { organization } = item;
						const { _count } = organization;

						return (
							<StatisticItem
								key={generateKeyComp(`${item}__${i}`)}
								icon={<Buildings size={32} />}
								title={organization.title}
								description={organization.description}
								subtitle={`Participants: ${_count?.organizationUsers}`}
								link={{ href: organization.id, text: "Look -->" }}
							/>
						);
					})
				) : (
					<NotFoundElement />
				)
			) : (
				<NotFoundElement />
			)}
		</StatisticBlock>
	);
}
