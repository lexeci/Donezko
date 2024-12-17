import { teamService } from "@/src/services/team.service";
import { ManageTeamData } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useRemoveUserFromTeam() {
	const [isUserRemoved, setIsUserRemoved] = useState<boolean>(false);

	const { mutate: removeUserFromTeam } = useMutation({
		mutationFn: ({ id, data }: { id: string; data: ManageTeamData }) =>
			teamService.removeUserFromTeam(id, data),
		onSuccess: () => {
			setIsUserRemoved(true);
		},
	});

	return { isUserRemoved, removeUserFromTeam, setIsUserRemoved };
}
