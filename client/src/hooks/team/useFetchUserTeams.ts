import {teamService} from "@/src/services/team.service";
import {TeamsResponse} from "@/types/team.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchUserTeams(organizationId?: string | null) {
    const [userTeamList, setUserTeamList] = useState<
        TeamsResponse[] | undefined
    >(undefined);

    const {data: userTeamsData, refetch, isFetching, isFetched} = useQuery({
        queryKey: ["teams for user"],
        queryFn: () => teamService.getUserTeams(organizationId as string), // Використання нового сервісу
        enabled: !!organizationId,
    });

    useEffect(() => {
        if (userTeamsData) {
            setUserTeamList(userTeamsData);
        }
    }, [userTeamsData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {userTeamList, setUserTeamList, handleRefetch, isFetching, isFetched};
}
