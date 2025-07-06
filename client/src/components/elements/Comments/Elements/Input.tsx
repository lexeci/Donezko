import { Button, Field } from "@/components/ui";
import { useCreateComments } from "@/hooks/comments/useCreateComments";
import { CommentFormData, CommentResponse } from "@/types/comment.types";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import styles from "../Comment.module.scss";

export interface Input {
  taskId: string; // Task ID the comment will be associated with
  organizationId: string | null; // Organization ID context for the comment
  setComments: Dispatch<SetStateAction<CommentResponse[] | undefined>>; // State setter to update the comments list
}

/**
 * Input component renders a form for adding new comments to a task.
 * It handles form submission, validates input, creates a new comment via
 * the useCreateComments hook, and updates the comments state on success.
 *
 * @param {Object} props - Component props
 * @param {string} props.taskId - Task ID for the comment association
 * @param {string | null} props.organizationId - Organization ID context
 * @param {Dispatch<SetStateAction<CommentResponse[] | undefined>>} props.setComments - Setter to update comments list state
 * @returns {JSX.Element}
 */
export default function Input({ taskId, organizationId, setComments }: Input) {
  const { createComment } = useCreateComments();

  // Initialize react-hook-form with validation mode on change
  const { register, handleSubmit, reset } = useForm<CommentFormData>({
    mode: "onChange",
  });

  /**
   * Handles form submission to create a new comment.
   * Calls createComment hook with task and organization context,
   * then updates the comments state by appending the new comment.
   * Resets the form after successful submission.
   *
   * @param {CommentFormData} data - Form data containing comment content
   */
  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
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
          if (data) {
            setComments((prevState) =>
              prevState ? [...prevState, data] : [data]
            );
          }
          reset(); // Clear the input field after successful comment creation
        },
      }
    );
  };

  return (
    // Comment input form with submit handler
    <form className={styles.actions} onSubmit={handleSubmit(onSubmit)}>
      {/* Text input field for comment content with validation */}
      <Field
        id="comment-input"
        placeholder="Your message here..."
        extra={styles["actions__fields"]}
        type="text"
        {...register("content", {
          required: "Message is required!",
        })}
      />

      {/* Send button with icon, currently type button (does not submit form) */}
      <Button type={"button"} block negative>
        Send <PaperPlaneTilt size={20} />
      </Button>
    </form>
  );
}
