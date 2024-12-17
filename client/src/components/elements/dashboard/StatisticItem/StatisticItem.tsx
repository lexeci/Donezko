import { AnimatedLink } from "@/components/index";
import { ReactNode } from "react";
import styles from "./StatisticItem.module.scss";

type StatisticItemProps = {
	icon: ReactNode; // Наприклад, <UsersThree />, <Buildings />, або <Rss />
	title: string;
	description: string;
	subtitle?: string; // Додатковий текст, наприклад, Teams | Tasks
	link?: { href: string; text: string }; // Опціональний посилання
};

export default function StatisticItem({
	icon,
	title,
	description,
	subtitle,
	link,
}: StatisticItemProps) {
	return (
		<div className={styles["statistic-item"]}>
			{icon}
			<div className={styles.about}>
				<div className={styles.title}>
					<h5>{title}</h5>
					{subtitle && <p>{`[${subtitle}]`}</p>}
				</div>
				<div className={styles.description}>
					<p>{description}</p>
				</div>
			</div>
			{link && <AnimatedLink link={link.href} title={link.text} negative />}
		</div>
	);
}
