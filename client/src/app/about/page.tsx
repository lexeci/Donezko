import { AnimatedLink, PageLayout } from "@/components/index";
import { INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";

import styles from "@/app/page.module.scss";

export const metadata: Metadata = {
	title: "About us",
	...INDEX_PAGE,
};

export default function About() {
	return (
		<PageLayout>
			<div className={styles["page-section"]}>
				<div className={styles["section-title"]}>
					<h4>About us</h4>
				</div>
				<div className={styles["main-title"]}>
					<h2>Time to get know each others</h2>
				</div>
				<div className={styles["intro-text"]}>
					<p>
						TPlanner - is new way to create your time or task management habits.
						There you will get most profits from scheduling your whole day.
					</p>
				</div>
			</div>
			<div className={styles["content-block"]}>
				<h3 className={styles["section-header"]}>Who Are We? 🤔</h3>
				<p className={styles["content-paragraph-clear"]}>
					We’re a small group of over-caffeinated developers who dared to dream
					big. Our goal? Build a tool that keeps people productive while subtly
					reminding them to take a break now and then (seriously, go drink some
					water).
				</p>

				<h3 className={styles["section-header"]}>Our Story 📖</h3>
				<p className={styles["intro-paragraph"]}>
					It all started during a late-night brainstorming session, fueled by
					the realization that planning and deadlines weren’t going to magically
					sort themselves out. Armed with IDEs, snacks, and the occasional
					coffee, we embarked on this journey to create TPlanner.
				</p>

				<div className={styles["team-section"]}>
					<h3 className={styles["section-header"]}>
						The People Behind TPlanner 👩‍💻👨‍💻
					</h3>
					<div className={styles["team-members"]}>
						<div className={styles["member-card"]}>
							<h4>Andriy Neaijko</h4>
							<p>UI/UX Wizard ✨</p>
							<p>Favorite tool: Figma & Cat memes</p>
						</div>
						<div className={styles["member-card"]}>
							<h4>Andriy Neaijko</h4>
							<p>Backend Overlord ⚙️</p>
							<p>Favorite debug strategy: *"Turn it off and on again"*.</p>
						</div>
						<div className={styles["member-card"]}>
							<h4>Andriy Neaijko</h4>
							<p>Frontend Guru 🌐</p>
							<p>Dreams in JavaScript and CSS animations.</p>
						</div>
					</div>
				</div>

				<h3 className={styles["section-header"]}>Why Open Source? 🌍</h3>
				<p className={styles["intro-paragraph"]}>
					We believe in sharing knowledge and building something greater
					together. TPlanner is for everyone—whether you’re a student struggling
					with assignments, a professional juggling deadlines, or someone who
					just really loves a good to-do list.
				</p>

				<h3 className={styles["section-header"]}>Join Us! 🚀</h3>
				<p className={styles["intro-paragraph"]}>
					Want to contribute? We’d love your help! Check out our
					<AnimatedLink
						negative
						link="/contribution-guidelines"
						title="Contribution Guidelines"
					/>
					and let’s build something amazing together. We promise it’ll be fun
					(and maybe a little chaotic). Just like life.
				</p>

				<div className={styles["footer-text-block"]}>
					<p className={styles["footer-text"]}>
						P.S. Remember, every great project starts with an idea... and a lot
						of perseverance. Also, if you’re reading this instead of working,
						you’re totally procrastinating. Go plan your next task with
						TPlanner! 😉
					</p>
				</div>
			</div>
		</PageLayout>
	);
}
