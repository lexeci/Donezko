import { teamService } from "@/src/services/team.service";
import { TeamsProjectResponse, TeamsResponse } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchTeamsByProject(
	organizationId: string | null,
	projectId: string | null
) {
	const { data: teamsData } = useQuery({
		queryKey: ["teams", organizationId, projectId],
		queryFn: () =>
			teamService.getAllTeamsByProject(organizationId as string, projectId as string),
		enabled: !!organizationId || !!projectId,
	});

	const [teamList, setTeamList] = useState<TeamsProjectResponse | undefined>(
		teamsData
	);

	useEffect(() => {
		setTeamList(teamsData);
	}, [teamsData]);

	return { teamList, setTeamList };
}
