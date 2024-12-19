import { teamService } from "@/src/services/team.service";
import { TeamsResponse } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchTeams(organizationId?: string | null) {
	const { data: teamsData } = useQuery({
		queryKey: ["teams", organizationId],
		queryFn: () => teamService.getAllTeams(organizationId as string),
		enabled: !!organizationId,
	});

	const [teamList, setTeamList] = useState<TeamsResponse[] | undefined>(
		teamsData
	);

	useEffect(() => {
		setTeamList(teamsData);
	}, [teamsData]);

	return { teamList, setTeamList };
}
