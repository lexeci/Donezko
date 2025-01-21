import {orgService} from "@/src/services/org.service";
import {ManageOrgUser, OrgResponse} from "@/types/org.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useUpdateOrgStatus() {
    const [updatedStatus, setUpdatedStatus] = useState<OrgResponse | undefined>(undefined);

    const {mutate: updateStatus, isPending} = useMutation({
        mutationKey: ['Update user status in organization'],
        mutationFn: (data: ManageOrgUser) =>
            orgService.updateStatusOrganization(data),
        onSuccess: data => {
            toast.success('Successfully updated user status in organization!');
            setUpdatedStatus(data);
        },
    });

    return {updateStatus, updatedStatus, isPending};
}
