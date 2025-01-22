import { teamService } from "@/src/services/team.service";
import { TeamsResponse } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchTeams(
	organizationId: string | null,
	projectId?: string | null
) {
	const [teamList, setTeamList] = useState<TeamsResponse[] | undefined>(
		undefined
	);

	const {
		data: teamsData,
		refetch,
		isFetching,
		isFetched,
	} = useQuery({
		queryKey: ["teams", organizationId, projectId],
		queryFn: () => teamService.getAllTeams(organizationId as string, projectId),
		enabled: !!organizationId,
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

	return { teamList, setTeamList, handleRefetch, isFetching, isFetched };
}
