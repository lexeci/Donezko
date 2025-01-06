import {commentsService} from "@/src/services/comments.service";
import {CommentResponse} from "@/types/comment.types";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchComments({taskId, organizationId}: { taskId?: string | null, organizationId?: string | null }) {
    const {data: commentsData} = useQuery<CommentResponse[] | undefined>({
        queryKey: ["comments", taskId],
        queryFn: () => commentsService.getAllComments(taskId as string, organizationId as string),
        enabled: !!taskId || !!organizationId,
        refetchInterval: 3000, // Оновлення кожні 3 секунд
    });

    const [comments, setComments] = useState<CommentResponse[]>(commentsData || []);

    useEffect(() => {
        if (commentsData) {
            setComments(commentsData);
        }
    }, [commentsData]);

    return {comments, setComments};
}
