import {teamService} from "@/src/services/team.service";
import {ManageTeamUser, TeamUsersResponse} from "@/types/team.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useUpdateTeamStatus() {
    const [updatedStatus, setUpdatedStatus] = useState<TeamUsersResponse | undefined>(
        undefined
    );

    const {mutate: updateStatus, isPending} = useMutation({
        mutationKey: ['Update team status'],
        mutationFn: (data: ManageTeamUser) => teamService.updateTeamStatus(data),
        onSuccess: data => {
            toast.success('Successfully update team user status!');
            setUpdatedStatus(data);
        },
    });

    return {updateStatus, updatedStatus, isPending};
}
