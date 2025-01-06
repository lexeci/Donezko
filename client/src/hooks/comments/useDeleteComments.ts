import {commentsService} from "@/src/services/comments.service";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";

export function useDeleteComments() {
    const queryClient = useQueryClient();
    const [deletedComment, setDeletedComment] = useState<any | undefined>(
        undefined
    );

    const {mutate: deleteComment} = useMutation({
        mutationFn: ({taskId, id, organizationId}: {
            taskId: string,
            id: string,
            organizationId: string
        }) => commentsService.deleteComment({taskId, id, organizationId}),
        onSuccess: data => {
            setDeletedComment(data);
            queryClient.invalidateQueries({queryKey: ["comments"]}); // Інвалідуємо список проектів
        },
    });

    return {deleteComment, deletedComment};
}