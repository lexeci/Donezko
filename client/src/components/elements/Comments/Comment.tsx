"use client";

import { useOrganization } from "@/context/OrganizationContext";
import { useFetchComments } from "@/hooks/comments/useFetchComments";
import { CommentResponse } from "@/types/comment.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { Chats } from "@phosphor-icons/react/dist/ssr";
import Input from "./Elements/Input";
import Message from "./Elements/Message";

import { useFetchUserProfile } from "@/src/hooks/user/useFetchUserProfile";
import clsx from "clsx";
import styles from "./Comment.module.scss";

interface Comments {
	taskId?: string | null;
}

export default function Comments({ taskId }: Comments) {
	const { organizationId } = useOrganization();
	const { profileData } = useFetchUserProfile();

	const { comments, setComments } = useFetchComments({
		taskId,
		organizationId,
	});

	return (
		taskId && (
			<div className={clsx(styles.comments, "bg-radial-grid-small")}>
				<div className={styles["comments__header"]}>
					<h5>Comments</h5>
					<Chats size={22} />
				</div>
				<div className={styles["comments__container"]}>
					{comments ? (
						comments.map(
							(
								{ id, user, createdAt, content }: CommentResponse,
								i: number
							) => (
								<Message
									setComments={setComments}
									id={id}
									organizationId={organizationId}
									taskId={taskId}
									author={user}
									time={createdAt}
									message={content}
									profileData={profileData}
									key={generateKeyComp(`${id}__${i}`)}
								/>
							)
						)
					) : (
						<div className={styles["comments__not-found"]}>
							<div className={styles["comments__not-found__title"]}>
								<h5>Oops, no comments here yet!</h5>
							</div>
							<div className={styles["comments__not-found__text-block"]}>
								<p>
									Looks like everyone is too shy to go first. Be the brave one
									to break the silence!
								</p>
							</div>
						</div>
					)}
				</div>
				{organizationId && (
					<Input
						taskId={taskId}
						organizationId={organizationId}
						setComments={setComments}
					/>
				)}
			</div>
		)
	);
}
