import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {orgService} from "@/src/services/org.service";
import {toast} from "sonner";

export function useExitOrg() {
    const [exitedOrganizationId, setExitedOrganizationId] = useState<string | undefined>(undefined);

    const {mutate: exitOrganization, isPending} = useMutation({
        mutationKey: ['Exit organization'],
        mutationFn: (id: string) => orgService.exitOrganization(id),
        onSuccess: (_, id) => {
            toast.success('Successfully exit organization!');
            setExitedOrganizationId(id);
        },
    });

    return {exitOrganization, exitedOrganizationId, isPending};
}
