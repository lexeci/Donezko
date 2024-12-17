import { Button } from "@/src/components/ui";
import { HandPointing } from "@phosphor-icons/react/dist/ssr";

import styles from "./Faqs.module.scss";

export default function Faqs() {
	return (
		<div className={styles.fagsBanner}>
			<div className={styles.sectionTitle}>
				<h4>Get stuck?</h4>
			</div>
			<div className={styles.mainTitle}>
				<h2>There is documentation for you</h2>
			</div>
			<div className={styles.textBlock}>
				<p>
					You can find any answers for any question in our documentation. Take a
					look and find more about how using our application
				</p>
			</div>
			<Button type="link" link="#" negative>
				Go to Documentation
				<HandPointing className={styles.button} size={22} cursor={"pointer"} />
			</Button>
		</div>
	);
}
