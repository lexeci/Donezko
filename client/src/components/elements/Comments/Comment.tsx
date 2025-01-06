'use client';

import {Chats} from "@phosphor-icons/react/dist/ssr";
import {CommentResponse} from "@/types/comment.types";
import Message from "./Elements/Message";
import Input from "./Elements/Input";
import {useFetchComments} from "@/hooks/comments/useFetchComments";
import {useOrganization} from "@/context/OrganizationContext";
import generateKeyComp from "@/utils/generateKeyComp";

interface Comments {
    taskId?: string | null;
}

export default function Comments({taskId}: Comments) {
    const {organizationId} = useOrganization()
    const {comments, setComments} = useFetchComments({taskId, organizationId});

    return taskId && (
        <div className="comments bg-radial-grid-small w-full h-full flex flex-col justify-start items-start">
            <div
                className="header flex justify-between items-center w-full border-b border-b-foreground py-2 px-4 bg-background">
                <h5 className="font-semibold">Comments</h5>
                <Chats size={22}/>
            </div>
            <div
                className="comments-container flex justify-end items-end flex-col h-full w-full px-2 py-4 overflow-y-auto">
                {comments ? comments.map(({id, user, createdAt, content}: CommentResponse, i: number) => (

                        <Message setComments={setComments} id={id} organizationId={organizationId} taskId={taskId}
                                 author={user}
                                 time={createdAt} message={content} key={generateKeyComp(`${id}__${i}`)}/>))
                    :
                    <div
                        className="no-comments bg-background flex flex-col justify-center items-center h-full w-full p-4 text-center">
                        <div className="title text-lg font-bold mb-2.5">
                            <h5>Oops, no comments here yet!</h5>
                        </div>
                        <div className="text-block max-w-72">
                            <p>Looks like everyone is too shy to go first. Be the brave one to break the silence!</p>
                        </div>
                    </div>
                }
            </div>
            {organizationId && <Input taskId={taskId} organizationId={organizationId} setComments={setComments}/>}
        </div>
    )
}