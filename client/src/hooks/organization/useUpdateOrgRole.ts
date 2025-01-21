import {orgService} from "@/src/services/org.service";
import {ManageOrgUser, OrgResponse, OrgUserResponse} from "@/types/org.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useUpdateOrgRole() {
    const [updatedRole, setUpdatedRole] = useState<OrgUserResponse | undefined>(undefined);

    const {mutate: updateRole, isPending} = useMutation({
        mutationKey: ['Update user role in organization'],
        mutationFn: (data: ManageOrgUser) =>
            orgService.updateRoleOrganization(data),
        onSuccess: data => {
            toast.success('Successfully updated user role in organization!');
            setUpdatedRole(data);
        },
    });
    return {updateRole, updatedRole, isPending};
}
