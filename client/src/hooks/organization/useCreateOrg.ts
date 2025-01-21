import {orgService} from "@/src/services/org.service";
import {Organization, OrgFormData} from "@/types/org.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useCreateOrg() {
    const [newOrganization, setNewOrganization] = useState<Organization | undefined>(
        undefined
    );

    const {mutate: createOrganization, isPending} = useMutation({
        mutationKey: ['Create organization'],
        mutationFn: (data: OrgFormData) => orgService.createOrganization(data),
        onSuccess: data => {
            toast.success('Successfully created organization!');
            setNewOrganization(data);
        },
    });

    return {createOrganization, newOrganization, isPending};
}
