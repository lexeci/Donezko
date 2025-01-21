import {teamService} from "@/src/services/team.service";
import {TeamFormData, TeamsResponse} from "@/types/team.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useCreateTeam() {
    const queryClient = useQueryClient()
    const [newTeam, setNewTeam] = useState<TeamsResponse | undefined>(undefined);

    const {mutate: createTeam, isPending} = useMutation({
        mutationKey: ['Create team'],
        mutationFn: (data: TeamFormData) => teamService.createTeam(data),
        onSuccess: data => {
            toast.success('Successfully created team!');
            setNewTeam(data);
        },
    });

    return {createTeam, newTeam, isPending};
}
