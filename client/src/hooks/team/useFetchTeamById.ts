import {teamService} from "@/src/services/team.service";
import {Team} from "@/types/team.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchTeamById(id: string, organizationId: string | null) {
    const [team, setTeam] = useState<Team | undefined>(undefined);

    const {data: teamData, refetch, isFetching, isFetched} = useQuery({
        queryKey: ["team", id, organizationId],
        queryFn: () => teamService.getTeamById(id, organizationId as string),
        enabled: !!organizationId,
    });

    useEffect(() => {
        if (teamData) {
            setTeam(teamData);
        }
    }, [teamData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {team, setTeam, handleRefetch, isFetching, isFetched};
}
