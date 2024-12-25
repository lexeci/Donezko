import { teamService } from "@/src/services/team.service";
import { ManageTeamUser } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useRemoveUserFromTeam() {
	const [isUserRemoved, setIsUserRemoved] = useState<boolean>(false);

	const { mutate: removeUser } = useMutation({
		mutationFn: (data: ManageTeamUser) =>
			teamService.removeUserFromTeam(data),
		onSuccess: () => {
			setIsUserRemoved(true);
		},
	});

	return { removeUser, isUserRemoved };
}
