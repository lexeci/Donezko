import { Button } from "@/components/index";
import clsx from "clsx";
import styles from "./PageHeader.module.scss";

interface PageHeader {
	pageTitle: string;
	title: string;
	desc: string;
	extraDesc?: string;
	joinCode?: string | boolean;
	extraInfo?: string | boolean;
	buttonAction?: () => void;
	button?: string | boolean;
}

export default function PageHeader({
	pageTitle,
	title,
	desc,
	extraDesc,
	joinCode,
	extraInfo,
	button,
	buttonAction,
}: PageHeader) {
	return (
		<div className={styles["page-section"]}>
			<div className={styles["section-title"]}>
				<h4>{pageTitle}</h4>
				{joinCode && (
					<p className={clsx(styles["join-code"], "bg-radial-grid-mini")}>
						<span>
							Join Code: <span>{joinCode}</span>
						</span>
					</p>
				)}
				{extraInfo && (
					<p className={styles["join-code"]}>
						<span>{extraInfo}</span>
					</p>
				)}
			</div>
			<div className={styles["main-title"]}>
				<h2>{title}</h2>
				{button && (
					<Button type="button" fullWidth block negative onClick={buttonAction}>
						{button}
					</Button>
				)}
			</div>
			<div className={styles["intro-text"]}>
				<p>{desc}</p>
				{extraDesc && (
					<p className={styles["intro-text__statistics"]}>{extraDesc}</p>
				)}
			</div>
		</div>
	);
}
