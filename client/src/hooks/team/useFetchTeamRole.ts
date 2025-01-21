import {teamService} from "@/src/services/team.service";
import {TeamRole} from "@/types/team.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchTeamRole(
    teamId?: string | null,
    organizationId?: string | null
) {
    const [teamRole, setTeamRole] = useState<{ role: TeamRole } | undefined>(
        undefined
    );

    const {data: teamData, refetch, isFetching, isFetched} = useQuery({
        queryKey: ["team role", teamId],
        queryFn: () =>
            teamService.getTeamRole({
                id: teamId as string,
                organizationId: organizationId as string,
            }),
        enabled: !!teamId || !!organizationId,
    });

    useEffect(() => {
        if (teamData) {
            setTeamRole(teamData);
        }
    }, [teamData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {teamRole, setTeamRole, handleRefetch, isFetching, isFetched};
}
