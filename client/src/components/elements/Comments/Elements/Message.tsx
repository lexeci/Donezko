'use client';

import clsx from "clsx";
import {formatTimestampToAmPm} from "@/utils/timeFormatter";
import {useFetchUserProfile} from "@/hooks/useFetchUserProfile";
import {AuthUser} from "@/types/auth.types";
import {useDeleteComments} from "@/hooks/comments/useDeleteComments";
import {Dispatch, SetStateAction} from "react";
import {CommentResponse} from "@/types/comment.types";
import {Trash} from "@phosphor-icons/react/dist/ssr";

interface Message {
    id: string;
    message: string;
    time: Date | undefined;
    author: AuthUser;
    taskId: string;
    organizationId: string | null;
    setComments: Dispatch<SetStateAction<CommentResponse[]>>
}

export default function Message({id, message, time, author, setComments, taskId, organizationId}: Message) {
    const {profileData} = useFetchUserProfile();
    const {deleteComment} = useDeleteComments();

    const handleDelete = (id: string) => {
        organizationId && deleteComment({
            taskId,
            id,
            organizationId,
        }, {
            onSuccess: data => {
                data && setComments(prevState => prevState.filter(comment => comment.id !== data.id));
            }
        })
    }

    return (
        <>
            <div className={"empty-space p-2"}></div>
            <div
                className={clsx("item flex flex-col bg-background max-w-[45%] min-w-[20vh] w-auto p-2 border border-black/20 gap-y-2.5", profileData?.user.id === author.id ? "ml-auto" : "mr-auto")}>
                <div
                    className="head flex justify-between items-center w-full gap-x-4 text-xs">
                    <p className="author">{author.name}</p>
                    <Trash size={16} onClick={() => handleDelete(id)}
                           className="cursor-pointer transition-all duration-300 opacity-25 hover:opacity-45"/>
                </div>
                <div className="message text-xs">
                    <p>{message}</p>
                </div>
                <div className="footer w-full flex justify-end item-center text-xs opacity-45">
                    {time && <p className="time">{formatTimestampToAmPm(time)}</p>}
                </div>
            </div>
        </>
    )
}