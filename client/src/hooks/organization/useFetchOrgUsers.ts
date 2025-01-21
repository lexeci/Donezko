import {orgService} from "@/src/services/org.service";
import {OrgUserResponse} from "@/types/org.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

interface useFetchOrgUsers {
    organizationId?: string | null;
    projectId?: string;
    teamId?: string;
    hideFromProject?: boolean;
    hideFromTeam?: boolean;
}

export function useFetchOrgUsers(
    {
        organizationId,
        projectId,
        teamId,
        hideFromProject,
        hideFromTeam,
    }: useFetchOrgUsers) {
    const [organizationUserList, setOrganizationUserList] = useState<
        OrgUserResponse[] | undefined
    >(undefined);

    const {data: orgData, refetch, isFetching, isFetched} = useQuery({
        queryKey: ["organization users", organizationId],
        queryFn: () =>
            orgService.getOrganizationUsers(
                organizationId as string,
                projectId,
                hideFromProject,
                teamId,
                hideFromTeam
            ),
        enabled: !!organizationId,
    });

    useEffect(() => {
        if (orgData) {
            setOrganizationUserList(orgData);
        }
    }, [orgData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {organizationUserList, setOrganizationUserList, handleRefetch, isFetching, isFetched};
}
