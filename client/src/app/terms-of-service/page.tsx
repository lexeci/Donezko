import { INDEX_PAGE } from "@/constants/seo.constants";
import { PageLayout } from "@/src/components";
import { Metadata } from "next";

import styles from "@/app/page.module.scss";

export const metadata: Metadata = {
	title: "Terms of Service",
	...INDEX_PAGE,
};

export default function TermsOfService() {
	return (
		<PageLayout>
			<div className={styles["page-section"]}>
				<div className={styles["section-title"]}>
					<h4>Terms of Service</h4>
				</div>
				<div className={styles["main-title"]}>
					<h2>Get more about or terms of service!</h2>
				</div>
				<div className={styles["intro-text"]}>
					<p>
						There is main features of our application that you might notice.
						Take a closer look over it.
					</p>
				</div>
			</div>
			<div className={styles["content-block"]}>
				<h3 className={styles["section-header"]}>Lets get started</h3>
				<p className={styles["intro-paragraph"]}>
					Welcome to TPlanner! 🎉 We're so glad you’re here. By using our app or
					code, you agree to the following fun-but-serious rules.
				</p>

				<h2 className={styles["section-title"]}>1.No Blame Game</h2>
				<p className={styles["content-paragraph"]}>
					TPlanner is an open-source project (and a diploma project, to be
					exact). It’s provided "as-is," meaning if something breaks, melts, or
					accidentally schedules your weekend for Wednesday, it’s not on us.
					You’re free to fix it though—that’s the beauty of open source! 🛠️
				</p>

				<h2 className={styles["section-title"]}>2.Share the Love ❤️</h2>
				<p className={styles["content-paragraph"]}>
					Feel free to use, modify, and share TPlanner. Just give us a shutout
					or include a credit somewhere. We worked hard on this, and a little
					appreciation goes a long way!
				</p>

				<h2 className={styles["section-title"]}>3.Don't Be Evil 👀</h2>
				<p className={styles["content-paragraph"]}>
					Use TPlanner responsibly. No hacking the matrix, scheduling time for
					evil plots, or creating a paradox. TPlanner was built for good vibes
					only. ✌️
				</p>

				<h2 className={styles["section-title"]}>4.No Promises 🚀</h2>
				<p className={styles["content-paragraph"]}>
					TPlanner makes no promises about its usefulness, stability, or ability
					to make you an organized genius. We believe in you, though!
				</p>

				<h2 className={styles["section-title"]}>5.Feedback is Welcome 📬</h2>
				<p className={styles["content-paragraph"]}>
					Got ideas, bugs, or compliments? Let us know on GitHub. We’re always
					up for making TPlanner better (and adding features we didn’t think of
					yet).
				</p>

				<h2 className={styles["section-title"]}>6.No Lawyers Allowed 👨‍⚖️🚫</h2>
				<p className={styles["content-paragraph"]}>
					These terms are intentionally simple and not legally binding. We’re
					just developers trying to graduate and help people organize their
					lives.
				</p>

				<h2 className={styles["section-title"]}>7.Use at Your Own Risk ⚠️</h2>
				<p className={styles["content-paragraph"]}>
					TPlanner isn’t responsible for missed deadlines, late-night cramming
					sessions, or existential crises caused by too much productivity. Use
					responsibly!
				</p>

				<div className={styles["footer-text-block"]}>
					<p className={styles["footer-text"]}>
						Thanks for using TPlanner! We hope it helps you stay on top of
						things while keeping life a little more fun. 🌟
					</p>
				</div>
			</div>
		</PageLayout>
	);
}
