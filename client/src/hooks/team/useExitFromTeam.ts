import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {teamService} from "@/src/services/team.service";

export function useExitFromTeam() {
    const [isExited, setIsExited] = useState<boolean>(false);

    const {mutate: exitFromTeam, isPending} = useMutation({
        mutationKey: ['Exit team'],
        mutationFn: (id: string) => teamService.exitFromTeam(id),
        onSuccess: () => {
            toast.success('Successfully exit from team!');
            setIsExited(true);
        },
    });

    return {exitFromTeam, isExited, isPending};
}
