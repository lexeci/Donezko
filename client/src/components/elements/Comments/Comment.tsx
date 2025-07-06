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
  taskId?: string | null; // Optional task ID to filter comments by task
}

/**
 * Comments component displays a list of comments for a given task.
 *
 * It fetches comments based on taskId and organization context, shows each comment
 * using the Message component, and provides an input for adding new comments if
 * the organization is defined.
 *
 * @param {Object} props - Component props
 * @param {string | null} [props.taskId] - Optional task ID to display comments for
 * @returns {JSX.Element | null} Rendered comments section or null if no taskId
 */
export default function Comments({ taskId }: Comments) {
  // Get current organization ID from context
  const { organizationId } = useOrganization();

  // Fetch logged-in user's profile data
  const { profileData } = useFetchUserProfile();

  // Fetch comments filtered by taskId and organizationId, along with setter to update comments
  const { comments, setComments } = useFetchComments({
    taskId,
    organizationId,
  });

  // Render comments section only if taskId is provided
  return (
    taskId && (
      <div className={clsx(styles.comments, "bg-radial-grid-small")}>
        {/* Header with title and chat icon */}
        <div className={styles["comments__header"]}>
          <h5>Comments</h5>
          <Chats size={22} />
        </div>

        {/* Container for comments or fallback message if none */}
        <div className={styles["comments__container"]}>
          {comments ? (
            comments.map(
              (
                { id, user, createdAt, content }: CommentResponse,
                i: number
              ) => (
                <Message
                  key={generateKeyComp(`${id}__${i}`)} // Unique key for each comment component
                  id={id} // Comment ID
                  organizationId={organizationId} // Current organization ID
                  taskId={taskId} // Current task ID
                  author={user} // Comment author info
                  time={createdAt} // Comment creation timestamp
                  message={content} // Comment content text
                  profileData={profileData} // Current user's profile data for context
                  setComments={setComments} // Setter to update comments list
                />
              )
            )
          ) : (
            // Display message when no comments are found
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

        {/* Show input box for adding new comments if organizationId is available */}
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
