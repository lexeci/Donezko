import styles from "./Welcome.module.scss";

export default function Welcome() {
	return (
		<div className={styles.welcomeBanner}>
			<div className={styles.title}>
				<h2>Start your new planning manager today!</h2>
			</div>
			<div className={styles.textBlock}>
				<p>
					Don't wait when your plans overwhelm you. Get rid of them today with
					our application TPlaner - time to plan your day.
				</p>
			</div>
		</div>
	);
}
