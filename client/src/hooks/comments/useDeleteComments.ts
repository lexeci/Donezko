import { commentsService } from "@/src/services/comments.service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Custom hook to delete a comment for a specific task and organization.
 *
 * @returns An object containing:
 *  - deleteComment: Function to trigger deletion with taskId, comment id, and organizationId.
 *  - deletedComment: Data returned after successful deletion.
 */
export function useDeleteComments() {
  // State to store the deleted comment data returned from the API
  const [deletedComment, setDeletedComment] = useState<any | undefined>(
    undefined
  );

  // useMutation hook for deleting a comment
  const { mutate: deleteComment } = useMutation({
    mutationKey: ["Delete comment"], // Unique mutation key
    mutationFn: ({
      taskId,
      id,
      organizationId,
    }: {
      taskId: string;
      id: string;
      organizationId: string;
    }) => commentsService.deleteComment({ taskId, id, organizationId }), // API call to delete comment
    onSuccess: (data) => {
      // Update local state with the deleted comment info on success
      setDeletedComment(data);
    },
  });

  // Return the mutate function and deleted comment data
  return { deleteComment, deletedComment };
}
