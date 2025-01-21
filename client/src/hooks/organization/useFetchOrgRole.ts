import {orgService} from "@/src/services/org.service";
import {OrgRole} from "@/types/org.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {AccessStatus} from "@/types/root.types";

export function useFetchOrgRole(organizationId: string | null) {
    const [organizationRole, setOrganizationRole] = useState<
        { role: OrgRole, status: AccessStatus } | undefined
    >(undefined);

    const {data: orgData, refetch, isFetching, isFetched, isError} = useQuery({
        queryKey: ["organization role", organizationId],
        queryFn: () => orgService.getOrganizationRole(organizationId as string),
        enabled: !!organizationId,
    });

    useEffect(() => {
        if (orgData) {
            setOrganizationRole(orgData);
        }
    }, [orgData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {organizationRole, setOrganizationRole, handleRefetch, isFetching, isFetched, isError};
}
