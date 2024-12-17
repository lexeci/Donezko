"use client";

import { WindowContainer } from "@/components/index";
import { PropsWithChildren } from "react";

import styles from "./ModalWindow.module.scss";

interface ModalWindow {
	title: string;
	subtitle: string;
	onClose: () => void;
}

export default function ModalWindow({
	title,
	subtitle,
	children,
	onClose,
}: PropsWithChildren<ModalWindow>) {
	return (
		<div className={styles["modal-window"]}>
			<div className={styles.container}>
				<WindowContainer
					title={title}
					subtitle={subtitle}
					fullPage
					onClose={onClose}
				>
					{children}
				</WindowContainer>
			</div>
		</div>
	);
}
