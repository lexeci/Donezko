import { commentsService } from "@/src/services/comments.service";
import { CommentResponse } from "@/types/comment.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchComments({
	taskId,
	organizationId,
}: {
	taskId?: string | null;
	organizationId?: string | null;
}) {
	const [comments, setComments] = useState<CommentResponse[] | undefined>(
		undefined
	);

	const {
		data: commentsData,
		refetch,
		isFetching,
		isFetched,
	} = useQuery<CommentResponse[] | undefined>({
		queryKey: ["comments", taskId],
		queryFn: () =>
			commentsService.getAllComments(
				taskId as string,
				organizationId as string
			),
		enabled: !!taskId || !!organizationId,
		refetchInterval: 3000, // Оновлення кожні 3 секунд
	});

	useEffect(() => {
		if (commentsData) {
			setComments(commentsData);
		}
	}, [commentsData]);

	// Функція для рефетчінгу
	const handleRefetch = () => {
		refetch(); // Викликає повторний запит
	};

	return { comments, setComments, handleRefetch, isFetching, isFetched };
}
