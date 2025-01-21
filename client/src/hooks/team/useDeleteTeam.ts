import {teamService} from "@/src/services/team.service";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useDeleteTeam() {
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    const {mutate: deleteTeam, isPending} = useMutation({
        mutationKey: ['Delete team'],
        mutationFn: (
            {
                teamId,
                organizationId,
            }: {
                teamId: string;
                organizationId: string;
            }) => teamService.deleteTeam(teamId, organizationId),
        onSuccess: () => {
            toast.success('Successfully deleted Team!');
            setIsDeleted(true);
        },
    });

    return {deleteTeam, isDeleted, isPending};
}
