import {teamService} from "@/src/services/team.service";
import {TeamsProjectResponse, TeamsResponse} from "@/types/team.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchTeamsByProject(
    organizationId?: string | null,
    projectId?: string | null
) {
    const [teamList, setTeamList] = useState<TeamsProjectResponse | undefined>(
        undefined
    );

    const {data: teamsData, refetch, isFetching, isFetched} = useQuery({
        queryKey: ["teams by project", organizationId, projectId],
        queryFn: () =>
            teamService.getAllTeamsByProject(organizationId as string, projectId as string),
        enabled: !!organizationId || !!projectId,
    });

    useEffect(() => {
        if (teamsData) {
            setTeamList(teamsData);
        }
    }, [teamsData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {teamList, setTeamList, handleRefetch, isFetching, isFetched};
}
