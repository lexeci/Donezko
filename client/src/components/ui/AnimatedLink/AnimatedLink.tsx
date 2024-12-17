import clsx from "clsx";
import Link from "next/link";
import styles from "./AnimatedLink.module.scss";

interface AnimatedLink {
	type?: "link" | "button";
	link: string;
	title: string;
	dark?: boolean;
	negative?: boolean;
	target?: string;
	rel?: string;
	onClick?: () => void;
}

export default function AnimatedLink({
	type = "link",
	link,
	title,
	dark = false,
	negative = false,
	target,
	rel,
	onClick,
}: AnimatedLink) {
	return type === "link" ? (
		<Link
			className={clsx(
				styles["underline-anim"],
				dark && styles.dark,
				negative && styles.negative
			)}
			target={target}
			rel={rel}
			href={link}
		>
			{title}
		</Link>
	) : (
		<div
			className={clsx(
				styles["underline-anim"],
				dark && styles.dark,
				negative && styles.negative
			)}
			rel={rel}
			onClick={onClick}
		>
			{title}
		</div>
	);
}
