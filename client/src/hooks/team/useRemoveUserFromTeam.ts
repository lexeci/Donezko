import {teamService} from "@/src/services/team.service";
import {ManageTeamUser} from "@/types/team.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useRemoveUserFromTeam() {
    const queryClient = useQueryClient()
    const [isUserRemoved, setIsUserRemoved] = useState<boolean>(false);

    const {mutate: removeUser, isPending} = useMutation({
        mutationKey: ['Remove user from team'],
        mutationFn: (data: ManageTeamUser) =>
            teamService.removeUserFromTeam(data),
        onSuccess: () => {
            toast.success('Successfully removed user from team!');
            setIsUserRemoved(true);
        },
    });

    return {removeUser, isUserRemoved, isPending};
}
