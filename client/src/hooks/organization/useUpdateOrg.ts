import {orgService} from "@/src/services/org.service";
import {OrgFormData, OrgResponse} from "@/types/org.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useUpdateOrg() {
    const [updatedOrganization, setUpdatedOrganization] =
        useState<OrgResponse | undefined>(undefined);

    const {mutate: updateOrganization, isPending} = useMutation({
        mutationKey: ['Update organization'],
        mutationFn: ({id, data}: { id: string; data: OrgFormData }) =>
            orgService.updateOrganization(id, data),
        onSuccess: data => {
            toast.success('Successfully updated organization!');
            setUpdatedOrganization(data);
        },
    });

    return {updateOrganization, updatedOrganization, isPending};
}
