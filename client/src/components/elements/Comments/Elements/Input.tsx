import {Button, Field} from "@/components/ui";
import {PaperPlaneTilt} from "@phosphor-icons/react/dist/ssr";
import {SubmitHandler, useForm} from "react-hook-form";
import {CommentFormData, CommentResponse} from "@/types/comment.types";
import {useCreateComments} from "@/hooks/comments/useCreateComments";
import {Dispatch, SetStateAction} from "react";

export interface Input {
    taskId: string;
    organizationId: string | null,
    setComments: Dispatch<SetStateAction<CommentResponse[]>>
}

export default function Input({taskId, organizationId, setComments}: Input) {

    const {createComment} = useCreateComments()

    const {register, handleSubmit, reset} = useForm<CommentFormData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<CommentFormData> = data => {
        createComment({
            taskId, data: {
                organizationId,
                ...data
            }
        }, {
            onSuccess(data) {
                data && setComments(prevState => [...prevState, data]);
                reset()
            }
        })
    }


    return (
        <form
            className="actions flex justify-between items-center w-full border-t border-t-foreground py-2 px-4 bg-background gap-x-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Field
                id="comment-input"
                placeholder="Your message here..."
                extra="block w-full max-w-full"
                type="text"
                {...register("content", {
                    required: "Message is required!",
                })}/>
            <Button type={"button"} block negative>Send <PaperPlaneTilt size={20}/></Button>
        </form>
    )
}