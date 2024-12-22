import { teamService } from "@/src/services/team.service";
import { TeamFormData, TeamsResponse } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useTeamCreation() {
	const [newTeam, setNewTeam] = useState<TeamsResponse | undefined>(undefined);

	const { mutate: createTeam } = useMutation({
		mutationFn: (data: TeamFormData) => teamService.createTeam(data),
		onSuccess: data => {
			setNewTeam(data);
		},
	});

	return { createTeam, newTeam };
}
