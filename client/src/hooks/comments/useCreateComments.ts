import {commentsService} from "@/src/services/comments.service";
import {CommentFormData} from "@/types/comment.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";

export function useCreateComments() {
    const queryClient = useQueryClient();
    const [createdComment, setCreatedComment] = useState<any | undefined>(
        undefined
    );

    const {mutate: createComment} = useMutation({
        mutationFn: ({taskId, data}: {
            taskId: string,
            data: CommentFormData
        }) => commentsService.createComment(taskId, data),
        onSuccess: data => {
            setCreatedComment(data);
            queryClient.invalidateQueries({queryKey: ["comments"]}); // Інвалідуємо список проектів
        },
    });

    return {createComment, createdComment};
}