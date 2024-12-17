import { AnimatedLink } from "@/components/index";
import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";

import styles from "./not-found.module.scss";

export const metadata: Metadata = {
	title: "Oh, no! Wrong page anyway...",
	...NO_INDEX_PAGE,
};

export default function NotFoundPage() {
	return (
		<div className={styles["not-found"]}>
			<p>4 0 4</p>
			<p>Guess today is not your day if you are on this page.</p>
			<AnimatedLink link="/" title="Please return me home!" />
		</div>
	);
}
