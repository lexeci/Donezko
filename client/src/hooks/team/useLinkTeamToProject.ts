import {teamService} from "@/src/services/team.service";
import {TeamsProjectResponse} from "@/types/team.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useLinkTeamToProject() {
    const queryClient = useQueryClient()
    const [linkedTeam, setLinkedTeam] = useState<TeamsProjectResponse | undefined>(undefined);

    const {mutate: linkTeamToProject, isPending} = useMutation({
        mutationKey: ['Link user to team'],
        mutationFn: (
            {
                id,
                projectId,
                organizationId,
            }: {
                id: string;
                projectId: string;
                organizationId: string;
            }) => teamService.linkToProject({id, projectId, organizationId}),
        onSuccess: data => {
            toast.success('Successfully linked user!');
            setLinkedTeam(data);
        },
    });

    return {linkTeamToProject, linkedTeam, isPending};
}
