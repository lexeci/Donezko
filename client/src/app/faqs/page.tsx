import { INDEX_PAGE } from "@/constants/seo.constants";
import { Accordion, PageLayout } from "@/src/components";
import generateKeyComp from "@/utils/generateKeyComp";
import { Metadata } from "next";

import styles from "@/app/page.module.scss";

export const metadata: Metadata = {
	title: "FAQ's - most common questions",
	...INDEX_PAGE,
};

export default function Faqs() {
	const questions = [
		{
			title: "What is x-data?",
			answer:
				"x-data is a directive in Alpine.js that allows you to declare component data.",
		},
		{
			title: "How does TPlanner work?",
			answer:
				"TPlanner helps you organize your tasks and schedule in a user-friendly interface.",
		},
		{
			title: "How to contribute?",
			answer:
				"You can contribute by forking the repository and submitting pull requests.",
		},
		{
			title: "What is open-source?",
			answer:
				"Open-source means that the source code is freely available for anyone to use, modify, and distribute.",
		},
		{
			title: "Is TPlanner free?",
			answer: "Yes, TPlanner is completely free to use and open-source.",
		},
	];

	return (
		<PageLayout>
			<div className={styles["page-section"]}>
				<div className={styles["section-title"]}>
					<h4>FAQ's</h4>
				</div>
				<div className={styles["main-title"]}>
					<h2>Most common questions about TPlanner</h2>
				</div>
				<div className={styles["intro-text"]}>
					<p>
						The FAQ's page contains answers to the most frequently asked
						questions of users. We want to make your experience with TPlanner as
						comfortable as possible.
					</p>
				</div>
			</div>
			<div className={styles["content-block"]}>
				<h3 className={styles["section-header"]}>
					Hey! You can find the answers for you questions:
				</h3>
				<p className={styles["intro-paragraph"]}>
					All most asked question to our project:
				</p>

				{questions.map((item, i) => (
					<Accordion
						title={item.title}
						answer={item.answer}
						key={generateKeyComp(`${item.title}_${i}`)}
					/>
				))}
			</div>
		</PageLayout>
	);
}
