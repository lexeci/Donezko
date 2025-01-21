import { Button, Field } from "@/components/ui";
import { useCreateComments } from "@/hooks/comments/useCreateComments";
import { CommentFormData, CommentResponse } from "@/types/comment.types";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import styles from "../Comment.module.scss";

export interface Input {
	taskId: string;
	organizationId: string | null;
	setComments: Dispatch<SetStateAction<CommentResponse[] | undefined>>;
}

export default function Input({ taskId, organizationId, setComments }: Input) {
	const { createComment } = useCreateComments();

	const { register, handleSubmit, reset } = useForm<CommentFormData>({
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<CommentFormData> = data => {
		createComment(
			{
				taskId,
				data: {
					organizationId,
					...data,
				},
			},
			{
				onSuccess(data) {
					data &&
						setComments(prevState =>
							prevState ? [...prevState, data] : [data]
						);
					reset();
				},
			}
		);
	};

	return (
		<form className={styles.actions} onSubmit={handleSubmit(onSubmit)}>
			<Field
				id="comment-input"
				placeholder="Your message here..."
				extra={styles["actions__fields"]}
				type="text"
				{...register("content", {
					required: "Message is required!",
				})}
			/>
			<Button type={"button"} block negative>
				Send <PaperPlaneTilt size={20} />
			</Button>
		</form>
	);
}
