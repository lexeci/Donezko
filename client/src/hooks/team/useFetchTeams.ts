import { teamService } from "@/src/services/team.service";
import { TeamWithUsersResponse } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchTeams(organizationId: string, projectId: string) {
	const { data: teamsData } = useQuery({
		queryKey: ["teams", organizationId, projectId],
		queryFn: () => teamService.getAllTeams(organizationId, projectId),
	});

	const [teamList, setTeamList] = useState<TeamWithUsersResponse[] | undefined>(
		teamsData
	);

	useEffect(() => {
		setTeamList(teamsData);
	}, [teamsData]);

	return { teamList, setTeamList };
}
