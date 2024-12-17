import { INDEX_PAGE } from "@/constants/seo.constants";
import { AsciiElement, PageLayout } from "@/src/components";
import { Metadata } from "next";

import styles from "@/app/page.module.scss";

export const metadata: Metadata = {
	title: "Behind the code",
	...INDEX_PAGE,
};

export default function About() {
	return (
		<PageLayout>
			<div className={styles["page-section"]}>
				<div className={styles["section-title"]}>
					<h4>Behind the code</h4>
				</div>
				<div className={styles["main-title"]}>
					<h2>That how we created our website project</h2>
				</div>
				<div className={styles["intro-text"]}>
					<p>
						We wanted to add a feature that brings coffee, but our server said
						'Nope.
					</p>
				</div>
			</div>
			<div className={styles["content-block-conga"]}>
				<div className={styles["content-block-conga__ascii-art"]}>
					<AsciiElement types="conga" />
				</div>
				<div className={styles["content-block-conga__content"]}>
					<h3>Conga! Conga! Conga!</h3>
					<p>Come on , shake your body baby, do the conga</p>
				</div>
			</div>
		</PageLayout>
	);
}
