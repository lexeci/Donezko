import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {orgService} from "@/src/services/org.service";
import {toast} from "sonner";

export function useDeleteOrg() {
    const [deletedOrganizationId, setDeletedOrganizationId] = useState<string | undefined>(undefined);

    const {mutate: deleteOrganization, isPending} = useMutation({
        mutationKey: ['Delete organization'],
        mutationFn: (id: string) => orgService.deleteOrganization(id),
        onSuccess: (_, id) => {
            toast.success('Successfully deleted organization!');
            setDeletedOrganizationId(id);
        },
    });

    return {deleteOrganization, deletedOrganizationId, isPending};
}
