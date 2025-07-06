"use client";

import { StatisticBlock } from "@/components/index";
import { useFetchUserProfile } from "@/hooks/user/useFetchUserProfile";
import styles from "./TasksBoardStatistic.module.scss";

/**
 * TasksBoardStatistic component displays an overview of user's daily task statistics.
 *
 * It fetches the user profile data via a custom hook and renders
 * task statistics inside a styled StatisticBlock.
 *
 * @returns {JSX.Element} A block showing task labels and their corresponding values.
 */
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
