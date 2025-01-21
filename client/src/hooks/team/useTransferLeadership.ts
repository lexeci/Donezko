import {teamService} from "@/src/services/team.service";
import {ManageTeamUser} from "@/types/team.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useTransferLeadership() {
    const [isLeadershipTransferred, setIsLeadershipTransferred] =
        useState<boolean>(false);

    const {mutate: transferLeadership, isPending} = useMutation({
        mutationKey: ['Transfer team'],
        mutationFn: (data: ManageTeamUser) =>
            teamService.transferLeadership(data),
        onSuccess: () => {
            toast.success('Successfully transferred team leadership!');
            setIsLeadershipTransferred(true);
        },
    });

    return {transferLeadership, isLeadershipTransferred, isPending};
}
