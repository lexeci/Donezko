import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {JoinOrgType, Organization} from "@/types/org.types";
import {orgService} from "@/src/services/org.service";
import {toast} from "sonner";

export function useJoinOrg() {
    const [joinedOrganization, setJoinedOrganization] = useState<Organization | undefined>(undefined);

    const {mutate: joinOrganization, isPending} = useMutation({
        mutationKey: ['Join organization'],
        mutationFn: (data: JoinOrgType) => orgService.joinOrganization(data),
        onSuccess: (data) => {
            toast.success('Successfully join organization!');
            setJoinedOrganization(data);
        },
    });

    return {joinOrganization, joinedOrganization, isPending};
}
