import { commentsService } from "@/src/services/comments.service";
import { CommentResponse } from "@/types/comment.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch comments for a specific task within an organization.
 *
 * @param taskId - ID of the task to fetch comments for (optional).
 * @param organizationId - ID of the organization (optional).
 *
 * @returns An object containing:
 *  - comments: The list of fetched comments.
 *  - setComments: Setter to manually update comments state.
 *  - handleRefetch: Function to manually trigger refetching comments.
 *  - isFetching: Boolean indicating if the query is currently fetching.
 *  - isFetched: Boolean indicating if the query has finished fetching.
 */
export function useFetchComments({
  taskId,
  organizationId,
}: {
  taskId?: string | null;
  organizationId?: string | null;
}) {
  // Local state to store the list of comments
  const [comments, setComments] = useState<CommentResponse[] | undefined>(
    undefined
  );

  // React Query hook to fetch comments from the API
  const {
    data: commentsData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery<CommentResponse[] | undefined>({
    queryKey: ["comments", taskId], // Unique key includes taskId to cache properly
    queryFn: () =>
      commentsService.getAllComments(
        taskId as string,
        organizationId as string
      ),
    enabled: !!taskId && !!organizationId, // Enable query only if both IDs are provided
    refetchInterval: 3000, // Automatically refetch every 3 seconds to get updates
  });

  // Sync query data into local state whenever new data arrives
  useEffect(() => {
    if (commentsData) {
      setComments(commentsData);
    }
  }, [commentsData]);

  // Function to manually trigger a refetch of comments
  const handleRefetch = () => {
    refetch();
  };

  // Return state and control functions for the component using this hook
  return { comments, setComments, handleRefetch, isFetching, isFetched };
}
