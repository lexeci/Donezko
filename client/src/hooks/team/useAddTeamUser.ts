import { teamService } from "@/src/services/team.service";
import { ManageTeamUser, TeamUsersResponse, TeamWithUsersResponse } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useAddTeamUser() {
	const [updatedTeam, setUpdatedTeam] = useState<
	TeamUsersResponse | undefined
	>(undefined);

	const { mutate: addUserToTeam } = useMutation({
		mutationFn: (data: ManageTeamUser) => teamService.addUserToTeam(data),
		onSuccess: data => {
			setUpdatedTeam(data);
		},
	});

	return { addUserToTeam, updatedTeam };
}
