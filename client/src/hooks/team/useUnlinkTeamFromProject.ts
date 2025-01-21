import {teamService} from "@/src/services/team.service";
import {TeamsProjectResponse} from "@/types/team.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useUnlinkTeamFromProject() {
    const [unlinkedTeam, setUnlinkedTeam] = useState<TeamsProjectResponse | undefined>(undefined);

    const {mutate: unlinkTeamFromProject, isPending} = useMutation({
        mutationKey: ['Unlink user from team'],
        mutationFn: (
            {
                id,
                projectId,
                organizationId,
            }: {
                id: string;
                projectId: string;
                organizationId: string;
            }) => teamService.unlinkFromProject({id, projectId, organizationId}),
        onSuccess: data => {
            toast.success('Successfully linked user to team!');
            setUnlinkedTeam(data);
        },
    });

    return {unlinkTeamFromProject, unlinkedTeam, isPending};
}
