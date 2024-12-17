"use client";

import { StatisticBlock } from "@/components/index";
import { useFetchUserProfile } from "@/src/hooks/useFetchUserProfile";
import styles from "./TasksBoardStatistic.module.scss";

export default function TasksBoardStatistic() {
	const { profileData, isDataLoading } = useFetchUserProfile();
	const statistics = profileData?.statistics;

	return (
		<StatisticBlock
			title="Tasks Overview"
			description="Your daily task statistics"
		>
			<div className={styles["statistics-item"]}>
				{statistics?.map((task, i) => (
					<div key={i} className={styles.item}>
						<h4 className={styles.title}>{task.label}</h4>
						<p className={styles.amount}>{task.value}</p>
					</div>
				))}
			</div>
		</StatisticBlock>
	);
}
