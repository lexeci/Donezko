import clsx from "clsx";
import Link from "next/link";
import { PropsWithChildren } from "react";
import styles from "./Button.module.scss";

interface Button {
	type: "link" | "button";
	link?: string;
	onClick?: (e?: any) => void;
	negative?: boolean;
	block?: boolean;
	fullWidth?: boolean;
	disabled?: boolean;
	modal?: boolean;
}

export default function Button({
	type,
	link = "#",
	onClick,
	children,
	negative = false,
	block = false,
	fullWidth = false,
	disabled = false,
	modal = false,
}: PropsWithChildren<Button>) {
	return type === "link" ? (
		<Link
			className={clsx(
				styles.button,
				negative && styles.negative,
				block && styles.block,
				fullWidth && styles.fullWidth
			)}
			href={link}
			onClick={onClick}
		>
			<span>{children}</span>
		</Link>
	) : (
		<button
			className={clsx(
				styles.button,
				negative && styles.negative,
				block && styles.block,
				fullWidth && styles.fullWidth,
				modal && styles.modal
			)}
			disabled={disabled}
			onClick={onClick}
		>
			<span>{children}</span>
		</button>
	);
}
