import { teamService } from "@/src/services/team.service";
import { TeamResponse, TeamsProjectResponse } from "@/src/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useUnlinkTeamFromProject() {
	const [unlinkedTeam, setUnlinkedTeam] = useState<TeamsProjectResponse>();

	const { mutate: unlinkTeamFromProject } = useMutation({
		mutationFn: ({
			id,
			projectId,
			organizationId,
		}: {
			id: string;
			projectId: string;
			organizationId: string;
		}) => teamService.unlinkFromProject({ id, projectId, organizationId }),
		onSuccess: data => {
			setUnlinkedTeam(data);
		},
	});

	return { unlinkTeamFromProject, unlinkedTeam };
}
