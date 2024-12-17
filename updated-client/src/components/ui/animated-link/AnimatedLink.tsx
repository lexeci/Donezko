import clsx from "clsx";
import Link from "next/link";
import styles from "./AnimatedLink.module.scss";

export default function AnimatedLink({
	link,
	title,
	dark = false,
	negative = false,
	target,
	rel,
}: {
	link: string;
	title: string;
	dark?: boolean;
	negative?: boolean;
	target?: string;
	rel?: string;
}) {
	return (
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
	);
}
