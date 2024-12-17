import generateKeyComp from "@/src/utils/generateKeyComp";
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
	selectable?: boolean;
	selectableArray?: { text: string }[];
	selectableOnClick?: any;
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
	selectable = false,
	selectableArray,
	selectableOnClick,
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
	) : selectable === true ? (
		<div
			className={clsx(
				styles.button,
				negative && styles.negative,
				block && styles.block,
				fullWidth && styles.fullWidth,
				modal && styles.modal,
				styles.selectable
			)}
		>
			<span>{children}</span>
			<div className={styles["selectable__container"]}>
				{selectableArray?.map((item, i) => (
					<div
						className={styles["selectable__item"]}
						onClick={() =>
							selectableOnClick &&
							selectableOnClick(item.text.toLocaleUpperCase())
						}
						key={generateKeyComp(`${item.text}__${i}`)}
					>
						<p>{item.text}</p>
					</div>
				))}
			</div>
		</div>
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
