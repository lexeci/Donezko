import {commentsService} from "@/src/services/comments.service";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";

export function useDeleteComments() {
    const [deletedComment, setDeletedComment] = useState<any | undefined>(
        undefined
    );

    const {mutate: deleteComment} = useMutation({
        mutationKey: ['Delete comment'],
        mutationFn: ({taskId, id, organizationId}: {
            taskId: string,
            id: string,
            organizationId: string
        }) => commentsService.deleteComment({taskId, id, organizationId}),
        onSuccess: data => {
            setDeletedComment(data);
        },
    });

    return {deleteComment, deletedComment};
}