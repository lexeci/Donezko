import { teamService } from "@/src/services/team.service";
import { TeamRole } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchTeamRole(
	teamId: string | null,
	organizationId: string | null
) {
	const { data: teamData } = useQuery({
		queryKey: ["team role", teamId],
		queryFn: () =>
			teamService.getTeamRole({
				id: teamId as string,
				organizationId: organizationId as string,
			}),
		enabled: !!teamId || !!organizationId,
	});

	const [teamRole, setTeamRole] = useState<{ role: TeamRole } | undefined>(
		teamData
	);

	useEffect(() => {
		setTeamRole(teamData);
	}, [teamData]);

	return { teamRole, setTeamRole };
}
