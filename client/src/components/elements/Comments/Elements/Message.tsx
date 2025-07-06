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
  id: string; // Unique identifier of the comment
  message: string; // Text content of the comment
  time: Date | undefined; // Timestamp when the comment was created
  author: AuthUser; // Author information of the comment
  taskId: string; // Task ID associated with the comment
  organizationId: string | null; // Organization ID context for the comment
  setComments: Dispatch<SetStateAction<CommentResponse[] | undefined>>; // State setter to update comments list
  profileData?: ProfileResponse; // Optional current user's profile data for UI logic
}

/**
 * Message component renders a single comment message with author, content,
 * timestamp, and a delete icon if applicable. It supports deleting the comment
 * and updating the comments state on successful deletion.
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Unique comment ID
 * @param {string} props.message - Comment text content
 * @param {Date | undefined} props.time - Timestamp of comment creation
 * @param {AuthUser} props.author - Author user data of the comment
 * @param {string} props.taskId - Task ID the comment belongs to
 * @param {string | null} props.organizationId - Organization ID context
 * @param {Dispatch<SetStateAction<CommentResponse[] | undefined>>} props.setComments - Setter to update comments state
 * @param {ProfileResponse} [props.profileData] - Optional current user profile data for UI logic
 * @returns {JSX.Element}
 */
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

  /**
   * Handles deletion of a comment by its ID. Calls deleteComment hook with
   * required identifiers and updates the comments state on success by
   * filtering out the deleted comment.
   *
   * @param {string} id - ID of the comment to delete
   */
  const handleDelete = (id: string) => {
    if (!organizationId) return; // Prevent deletion if no organization ID

    deleteComment(
      {
        taskId,
        id,
        organizationId,
      },
      {
        onSuccess: (data) => {
          if (data) {
            setComments((prevState) =>
              prevState
                ? prevState.filter((comment) => comment.id !== data.id)
                : []
            );
          }
        },
      }
    );
  };

  return (
    <>
      {/* Empty spacer div for layout alignment */}
      <div className={styles["empty-space"]}></div>

      {/* Main comment message container */}
      <div
        className={clsx(
          styles.message,
          // Align message to right if current user is author, otherwise left
          profileData?.user.id === author.id ? "ml-auto" : "mr-auto"
        )}
      >
        {/* Header containing author name and delete icon */}
        <div className={styles["message__head"]}>
          <p className={styles["message__author"]}>{author.name}</p>

          {/* Trash icon to trigger comment deletion */}
          <Trash
            size={16}
            onClick={() => handleDelete(id)}
            className={styles["message__ico"]}
          />
        </div>

        {/* Content area showing the comment text */}
        <div className={styles["message__content"]}>
          <p>{message}</p>
        </div>

        {/* Footer displaying formatted timestamp if available */}
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
