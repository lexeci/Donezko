import { AnimatedLink, PageLayout } from "@/components/index";
import { INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";

import styles from "@/app/page.module.scss";

export const metadata: Metadata = {
	title: "Legal",
	...INDEX_PAGE,
};

export default function Legal() {
	return (
		<PageLayout>
			<div className={styles["page-section"]}>
				<div className={styles["section-title"]}>
					<h4>Legal</h4>
				</div>
				<div className={styles["main-title"]}>
					<h2>Transparency is our top priority.</h2>
				</div>
				<div className={styles["intro-text"]}>
					<p>
						TPlanner is built with the help of amazing open-source libraries.
						This page outlines the legal aspects of using and distributing our
						project.
					</p>
				</div>
			</div>
			<div className={styles["content-block"]}>
				<h3 className={styles["section-header"]}>
					Open-Source Libraries We Use:
				</h3>
				<p className={styles["content-paragraph-ul"]}>
					Our project wouldn’t be possible without the incredible work of the
					open-source community. Below is a non-exhaustive list of libraries and
					tools that power TPlanner:
				</p>
				<ul className={styles["content-ul"]}>
					<li>
						<strong>React</strong>: The foundation of our UI.{" "}
						<AnimatedLink
							link="https://reactjs.org/"
							target="_blank"
							rel="noopener noreferrer"
							title={"Learn more. ->"}
						/>
					</li>
					<li>
						<strong>Next.js</strong>: For seamless server-side rendering and
						routing.
						<AnimatedLink
							link="https://nextjs.org/"
							target="_blank"
							rel="noopener noreferrer"
							title={"Learn more. ->"}
						/>
					</li>
					<li>
						<strong>Tailwind CSS</strong>: For effortless styling.{" "}
						<AnimatedLink
							link="https://tailwindcss.com/"
							target="_blank"
							rel="noopener noreferrer"
							title={"Learn more. ->"}
						/>
					</li>
					<li>
						<strong>TypeScript</strong>: To keep our code safe and predictable.{" "}
						<AnimatedLink
							link="https://www.typescriptlang.org/"
							target="_blank"
							rel="noopener noreferrer"
							title={"Learn more. ->"}
						/>
					</li>
				</ul>

				<h3 className={styles["section-header"]}>Licensing:</h3>
				<p className={styles["content-paragraph-ul"]}>
					TPlanner itself is released under the <strong>MIT License</strong>.
					This means:
				</p>
				<ul className={styles["content-ul"]}>
					<li>You are free to use, modify, and distribute our code.</li>
					<li>
						Attribution is appreciated but not mandatory (though we’d love a
						shutout!).
					</li>
					<li>
						No warranties are provided—use it at your own risk (but we’ve got
						your back with a friendly community).
					</li>
				</ul>

				<h3 className={styles["section-header"]}>Respect for Licenses:</h3>
				<p className={styles["intro-paragraph"]}>
					We ensure that every library or tool we use complies with their
					respective licenses. If you’re contributing code to TPlanner, please
					ensure that any third-party dependencies you include also respect
					open-source licensing norms.
				</p>

				<h3 className={styles["section-header"]}>Your Contributions:</h3>
				<p className={styles["intro-paragraph"]}>
					By contributing to TPlanner, you agree to license your contributions
					under the MIT License. This helps us keep the project open and
					accessible for everyone.
				</p>

				<div className={styles["footer-text-block"]}>
					<p className={styles["footer-text"]}>
						If you have questions about licensing or legal aspects, feel free to
						reach out via GitHub discussions or issues. We’re not lawyers, but
						we’ll do our best to clarify. 😉
					</p>
				</div>
			</div>
		</PageLayout>
	);
}
