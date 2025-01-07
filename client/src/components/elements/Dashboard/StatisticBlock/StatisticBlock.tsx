import { Button } from "@/components/ui";
import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./StatisticBlock.module.scss"; // Імпорт модульного SCSS

type StatisticBlockProps = {
	title: string;
	children?: ReactNode;
	className?: string;
	description: string;
	button?: { title: string; link: string };
};

export default function StatisticBlock({
	title,
	description,
	button,
	children,
	className,
}: StatisticBlockProps) {
	return (
		<div
			className={clsx(styles["board-statistics-block"], className)} // Використовуємо clsx для комбінування класів
		>
			<div className={styles.header}>
				<div className={styles.about}>
					<div className={styles.title}>
						<h4>{title}</h4>
					</div>
					<div className={styles.description}>
						<p>{description}</p>
					</div>
				</div>
				{button && (
					<Button type="link" link={button.link} block negative>
						{button.title}
					</Button>
				)}
			</div>
			<div className={styles.content}>{children}</div>
		</div>
	);
}
