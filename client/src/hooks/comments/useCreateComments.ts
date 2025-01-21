import {commentsService} from "@/src/services/comments.service";
import {CommentFormData} from "@/types/comment.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";

export function useCreateComments() {
    const [createdComment, setCreatedComment] = useState<any | undefined>(
        undefined
    );

    const {mutate: createComment} = useMutation({
        mutationKey: ['Create comment'],
        mutationFn: ({taskId, data}: {
            taskId: string,
            data: CommentFormData
        }) => commentsService.createComment(taskId, data),
        onSuccess: data => {
            setCreatedComment(data);
        },
    });

    return {createComment, createdComment};
}