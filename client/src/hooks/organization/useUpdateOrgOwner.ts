import {orgService} from "@/src/services/org.service";
import {OrgResponse, OrgUserResponse} from "@/types/org.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useUpdateOrgOwner() {
    const [updatedOwner, setUpdatedOwner] = useState<OrgUserResponse | undefined>(undefined);

    const {mutate: updateOwner, isPending} = useMutation({
        mutationKey: ['Update owner organization'],
        mutationFn: ({id, orgUserId}: { id: string; orgUserId: string }) =>
            orgService.updateOwnerOrganization(id, orgUserId),
        onSuccess: data => {
            toast.success('Successfully updated owner of organization!');
            setUpdatedOwner(data);
        },
    });

    return {updateOwner, updatedOwner, isPending};
}
