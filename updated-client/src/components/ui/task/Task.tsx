import { CaretUp, ThumbsUp } from "@phosphor-icons/react/dist/ssr";
import AsciiElement from "../ascii-element/AsciiElement";
import styles from "./Task.module.scss"; // Імпортуємо SCSS модуль

export default function Task() {
	return (
		<div className={styles.taskKanban}>
			<div className={styles.topBar}>
				<div className={styles.author}>
					<p>
						<b>Author</b>:
						<br /> Andriy Neaijko
					</p>
				</div>
				<div className={styles.time}>
					<p>
						<b>
							Time
							<span>:</span>
						</b>
						11:34pm
					</p>
				</div>
			</div>
			<div className={styles.content}>
				<div className={styles.title}>
					<h3>
						<b>
							<span>Task:</span>
						</b>
						Finish website design
					</h3>
				</div>
				<div className={styles.description}>
					<p>It's time to get this website done!</p>
				</div>

				<div className={styles.priority}>
					<p>
						<b>Priority:</b> High
					</p>
				</div>
			</div>
			<div className={styles.actions}>
				<div className={styles.comments}>
					<p>Complete</p>
					<ThumbsUp />
				</div>
				<div className={`${styles.comments} ${styles.lastComment}`}>
					<p>Comments:0</p>
					<CaretUp />
				</div>
			</div>
			<div className={styles.bottomBar}>
				<div className={styles.team}>
					<p>
						<b>Team:</b> Insomnia Works
					</p>
				</div>
				<div className={styles.status}>
					<p>Status: </p> <AsciiElement types="loading" />
				</div>
			</div>
		</div>
	);
}
