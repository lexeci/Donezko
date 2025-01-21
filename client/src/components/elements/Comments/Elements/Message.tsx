"use client";

import { useDeleteComments } from "@/hooks/comments/useDeleteComments";
import { AuthUser } from "@/types/auth.types";
import { CommentResponse } from "@/types/comment.types";
import { formatTimestampToAmPm } from "@/utils/timeFormatter";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

import { ProfileResponse } from "@/src/services/user.service";
import styles from "../Comment.module.scss";

interface Message {
	id: string;
	message: string;
	time: Date | undefined;
	author: AuthUser;
	taskId: string;
	organizationId: string | null;
	setComments: Dispatch<SetStateAction<CommentResponse[] | undefined>>;
	profileData?: ProfileResponse;
}

export default function Message({
	id,
	message,
	time,
	author,
	setComments,
	taskId,
	organizationId,
	profileData,
}: Message) {
	const { deleteComment } = useDeleteComments();

	const handleDelete = (id: string) => {
		organizationId &&
			deleteComment(
				{
					taskId,
					id,
					organizationId,
				},
				{
					onSuccess: data => {
						data &&
							setComments(prevState =>
								prevState
									? prevState.filter(comment => comment.id !== data.id)
									: []
							);
					},
				}
			);
	};

	return (
		<>
			<div className={styles["empty-space"]}></div>
			<div
				className={clsx(
					styles.message,
					profileData?.user.id === author.id ? "ml-auto" : "mr-auto"
				)}
			>
				<div className={styles["message__head"]}>
					<p className={styles["message__author"]}>{author.name}</p>
					<Trash
						size={16}
						onClick={() => handleDelete(id)}
						className={styles["message__ico"]}
					/>
				</div>
				<div className={styles["message__content"]}>
					<p>{message}</p>
				</div>
				<div className={styles["message__footer"]}>
					{time && (
						<p className={styles["message__time"]}>
							{formatTimestampToAmPm(time)}
						</p>
					)}
				</div>
			</div>
		</>
	);
}
