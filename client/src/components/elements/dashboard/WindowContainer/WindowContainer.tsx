import { Minus, Square, X } from "@phosphor-icons/react/dist/ssr";
import { PropsWithChildren } from "react";

import clsx from "clsx";
import styles from "./WindowContainer.module.scss";

type WindowContainerProps = {
	title: string; // Заголовок контейнера.
	subtitle: string; // Додаткова інформація, наприклад, кількість проектів.
	fullPage?: boolean;
	onClose?: () => void;
};

export default function WindowContainer({
	title,
	subtitle,
	children,
	fullPage = false,
	onClose,
}: PropsWithChildren<WindowContainerProps>) {
	return (
		<div
			className={clsx(
				styles.window,
				fullPage && styles["full-page"],
				"bg-radial-grid-small"
			)}
		>
			<div className={styles.header}>
				<div className={styles.title}>
					<h5>{title}</h5>
					<span>-</span>
					<p>{subtitle}</p>
				</div>
				<div className={styles.actions}>
					<div className={styles.item}>
						<Minus size={16} />
					</div>
					<div className={styles.item}>
						<Square size={16} />
					</div>
					<div
						className={clsx(styles.item, onClose && "cursor-pointer")}
						onClick={onClose}
					>
						<X size={16} />
					</div>
				</div>
			</div>
			<div className={styles.content}>{children}</div>
			<div className={styles.footer}>
				<h5>© TPlanner 2024. All Rights Reserved by Andriy Neaijko.</h5>
				<p>{"¯\\_(ツ)_/¯"}</p>
			</div>
		</div>
	);
}
