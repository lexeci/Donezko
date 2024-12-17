import styles from "./PageHeader.module.scss";

interface PageHeader {
	pageTitle: string;
	title: string;
	desc: string;
}

export default function PageHeader({ pageTitle, title, desc }: PageHeader) {
	return (
		<div className={styles["page-section"]}>
			<div className={styles["section-title"]}>
				<h4>{pageTitle}</h4>
			</div>
			<div className={styles["main-title"]}>
				<h2>{title}</h2>
			</div>
			<div className={styles["intro-text"]}>
				<p>{desc}</p>
			</div>
		</div>
	);
}
