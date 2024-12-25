import { TaskResponse } from "@/types/task.types";
import { CaretUp, ThumbsUp } from "@phosphor-icons/react/dist/ssr";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import AsciiElement from "../AsciiElement/AsciiElement";
import styles from "./Task.module.scss"; // Імпортуємо SCSS модуль

interface TaskElement {
	isBannerElem?: boolean;
	removeTask?: UseMutateFunction<
		AxiosResponse<any, any>,
		Error,
		string,
		unknown
	>;
	updateTasks?: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
	control?: Control<Partial<Omit<TaskResponse, "id" | "updatedAt">>, any>;
	register?: UseFormRegister<Partial<Omit<TaskResponse, "id" | "updatedAt">>>;
	watch?: UseFormWatch<Partial<Omit<TaskResponse, "id" | "updatedAt">>>;
}

export default function Task({
	isBannerElem = false,
	removeTask,
	updateTasks,
	control,
	register,
	watch,
}: TaskElement) {
	return (
		<div
			className={clsx(styles.taskKanban, isBannerElem && styles["full-parent"])}
		>
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
