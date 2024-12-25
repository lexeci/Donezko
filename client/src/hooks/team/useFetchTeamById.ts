import { teamService } from "@/src/services/team.service";
import { Team } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchTeamById(id: string, organizationId: string | null) {
	const { data: teamData } = useQuery({
		queryKey: ["team", id, organizationId],
		queryFn: () => teamService.getTeamById(id, organizationId as string),
		enabled: !!organizationId,
	});

	const [team, setTeam] = useState<Team | undefined>(teamData);

	useEffect(() => {
		setTeam(teamData);
	}, [teamData]);

	return { team, setTeam };
}
