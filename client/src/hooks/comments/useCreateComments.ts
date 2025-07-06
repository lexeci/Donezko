import { commentsService } from "@/src/services/comments.service";
import { CommentFormData, CommentResponse } from "@/types/comment.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Custom hook to create a new comment for a specific task.
 *
 * @returns An object containing:
 *  - createComment: Mutation function to create a comment. Accepts an object with:
 *      - taskId: ID of the task to which the comment belongs.
 *      - data: The comment data to be created (CommentFormData).
 *  - createdComment: The response data of the newly created comment (or undefined if not created yet).
 */
export function useCreateComments() {
  // Local state to hold the newly created comment data
  const [createdComment, setCreatedComment] = useState<
    CommentResponse | undefined
  >(undefined);

  // Mutation hook to call the service and create a comment
  const { mutate: createComment } = useMutation({
    mutationKey: ["Create comment"], // Unique mutation key
    mutationFn: ({ taskId, data }: { taskId: string; data: CommentFormData }) =>
      commentsService.createComment(taskId, data),
    onSuccess: (data) => {
      // Update local state when creation succeeds
      setCreatedComment(data);
    },
  });

  // Return mutation function and created comment data
  return { createComment, createdComment };
}
