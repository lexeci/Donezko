import { teamService } from "@/src/services/team.service";
import { ManageTeamUser, TeamWithUsersResponse } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useAddTeamUser() {
	const [updatedTeam, setUpdatedTeam] = useState<
		TeamWithUsersResponse | undefined
	>(undefined);

	const { mutate: addUserToTeam } = useMutation({
		mutationFn: ({ id, data }: { id: string; data: ManageTeamUser }) =>
			teamService.addUserToTeam(id, data),
		onSuccess: data => {
			setUpdatedTeam(data);
		},
	});

	return { addUserToTeam, updatedTeam };
}
