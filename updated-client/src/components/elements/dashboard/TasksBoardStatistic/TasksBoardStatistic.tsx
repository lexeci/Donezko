import { StatisticBlock } from "@/components/index";
import styles from "./TasksBoardStatistic.module.scss";

const tasks = [
	{ title: "Task done:", amount: 12 },
	{ title: "Task to do:", amount: 9 },
	{ title: "Task In progress:", amount: 3 },
	{ title: "Task dropped:", amount: 0 },
];

export default function TasksBoardStatistic() {
	return (
		<StatisticBlock
			title="Tasks Overview"
			description="Your daily task statistics"
		>
			<div className={styles["statistics-item"]}>
				{tasks.map((task, i) => (
					<div key={i} className={styles.item}>
						<h4 className={styles.title}>{task.title}</h4>
						<p className={styles.amount}>{task.amount}</p>
					</div>
				))}
			</div>
		</StatisticBlock>
	);
}
