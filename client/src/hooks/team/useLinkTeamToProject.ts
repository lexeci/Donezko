import { teamService } from "@/src/services/team.service";
import { TeamsProjectResponse } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useLinkTeamToProject() {
	const [linkedTeam, setLinkedTeam] = useState<TeamsProjectResponse>();

	const { mutate: linkTeamToProject } = useMutation({
		mutationFn: ({
			id,
			projectId,
			organizationId,
		}: {
			id: string;
			projectId: string;
			organizationId: string;
		}) => teamService.linkToProject({ id, projectId, organizationId }),
		onSuccess: data => {
			setLinkedTeam(data);
		},
	});

	return { linkTeamToProject, linkedTeam };
}
