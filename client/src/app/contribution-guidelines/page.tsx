import { INDEX_PAGE } from "@/constants/seo.constants";
import { PageLayout } from "@/src/components";
import { Metadata } from "next";

import styles from "@/app/page.module.scss";

export const metadata: Metadata = {
	title: "Contribution Guidelines",
	...INDEX_PAGE,
};

export default function ContributionGuidelines() {
	return (
		<PageLayout>
			<div className={styles["page-section"]}>
				<div className={styles["section-title"]}>
					<h4>Contribution Guidelines</h4>
				</div>
				<div className={styles["main-title"]}>
					<h2>Let's make TPlanner better—together!</h2>
				</div>
				<div className={styles["intro-text"]}>
					<p>
						Welcome to the TPlanner open-source project! We're thrilled you’re
						here. Whether you’re fixing bugs, adding features, or just cheering
						us on, we appreciate your contribution.
					</p>
				</div>
			</div>
			<div className={styles["content-block"]}>
				<h3 className={styles["section-header"]}>How to Contribute:</h3>
				<p className={styles["intro-paragraph"]}>
					Here are a few simple guidelines to help you get started. No stress,
					no pressure—just some friendly tips.
				</p>

				<h2 className={styles["section-title"]}>1. Fork It, Baby! 🍴</h2>
				<p className={styles["content-paragraph"]}>
					Start by forking the repository on GitHub. This gives you your very
					own copy to experiment with. Go wild—just not too wild. 😜
				</p>

				<h2 className={styles["section-title"]}>
					2. Follow Our Code of Conduct 🤝
				</h2>
				<p className={styles["content-paragraph"]}>
					Be respectful, inclusive, and kind. Open source is about community,
					and we want everyone to feel welcome. Think twice before roasting
					someone’s code (unless it's your own).
				</p>

				<h2 className={styles["section-title"]}>3. Find a Task 🛠️</h2>
				<p className={styles["content-paragraph"]}>
					Check out our issue tracker on GitHub. We’ve labeled tasks to help you
					find something that matches your skills. Newbie? Look for the “good
					first issue” tag. Pro? Dive into the tricky stuff.
				</p>

				<h2 className={styles["section-title"]}>4. Make It Shine ✨</h2>
				<p className={styles["content-paragraph"]}>
					Write clean, readable code. Add comments if something’s complex.
					Follow the existing code style (or fix it if it’s terrible—we won’t
					mind). Don't forget to test your changes before pushing!
				</p>

				<h2 className={styles["section-title"]}>5. Submit a Pull Request 📬</h2>
				<p className={styles["content-paragraph"]}>
					Once you’re happy with your changes, submit a pull request. Write a
					clear description, explain why your changes matter, and reference any
					related issues. Pro tip: adding memes always helps. 🐸
				</p>

				<h2 className={styles["section-title"]}>6. Review and Iterate 🔄</h2>
				<p className={styles["content-paragraph"]}>
					Our maintainers will review your PR. Don’t worry if they request
					changes—it’s all part of the process. Update your code, resubmit, and
					celebrate when it’s merged! 🎉
				</p>

				<h2 className={styles["section-title"]}>7. Spread the Word 📢</h2>
				<p className={styles["content-paragraph"]}>
					Once you’re a proud contributor, share your experience with friends,
					family, or your pet goldfish. Encourage others to join the TPlanner
					adventure.
				</p>

				<div className={styles["footer-text-block"]}>
					<p className={styles["footer-text"]}>
						Thanks for contributing to TPlanner! Together, we can build
						something truly amazing (and maybe graduate while we’re at it).
					</p>
				</div>
			</div>
		</PageLayout>
	);
}
