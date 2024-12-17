import { teamService } from "@/src/services/team.service";
import { TeamFormData, TeamResponse } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useModifyTeam() {
	const [updatedTeam, setUpdatedTeam] = useState<TeamResponse | undefined>(
		undefined
	);

	const { mutate: updateTeam } = useMutation({
		mutationFn: ({ id, data }: { id: string; data: TeamFormData }) =>
			teamService.updateTeam(id, data),
		onSuccess: data => {
			setUpdatedTeam(data);
		},
	});

	return { updatedTeam, updateTeam, setUpdatedTeam };
}
