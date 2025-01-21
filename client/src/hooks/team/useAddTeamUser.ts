import {teamService} from "@/src/services/team.service";
import {ManageTeamUser, TeamUsersResponse} from "@/types/team.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useAddTeamUser() {
    const [updatedTeam, setUpdatedTeam] = useState<
        TeamUsersResponse | undefined
    >(undefined);

    const {mutate: addUserToTeam, isPending} = useMutation({
        mutationKey: ['Add user to team'],
        mutationFn: (data: ManageTeamUser) => teamService.addUserToTeam(data),
        onSuccess: data => {
            toast.success('Successfully added user!');
            setUpdatedTeam(data);
        },
    });

    return {addUserToTeam, updatedTeam, isPending};
}
