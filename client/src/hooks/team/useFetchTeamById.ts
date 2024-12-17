import { teamService } from "@/src/services/team.service";
import { TeamWithUsersResponse } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchTeamById(
	id: string,
	organizationId: string,
	projectId: string
) {
	const { data: teamData } = useQuery({
		queryKey: ["team", id, organizationId, projectId],
		queryFn: () => teamService.getTeamById(id, organizationId, projectId),
	});

	const [team, setTeam] = useState<TeamWithUsersResponse | undefined>(teamData);

	useEffect(() => {
		setTeam(teamData);
	}, [teamData]);

	return { team, setTeam };
}
