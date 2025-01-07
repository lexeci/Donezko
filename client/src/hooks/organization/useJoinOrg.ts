import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {JoinOrgType, Organization} from "@/types/org.types";
import {orgService} from "@/src/services/org.service";

export function useJoinOrg() {
    const queryClient = useQueryClient();
    const [joinedOrganization, setJoinedOrganization] = useState<Organization | null>(null);

    const {mutate: joinOrganization} = useMutation({
        mutationFn: (data: JoinOrgType) => orgService.joinOrganization(data),
        onSuccess: (data) => {
            setJoinedOrganization(data);
            queryClient.invalidateQueries({queryKey: ["organizations"]});
        },
    });

    return {joinOrganization, joinedOrganization};
}
