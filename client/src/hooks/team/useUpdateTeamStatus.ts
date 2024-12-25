import { teamService } from "@/src/services/team.service";
import { ManageTeamUser, TeamUsersResponse } from "@/src/types/team.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useUpdateTeamStatus() {
	const queryClient = useQueryClient();
	const [updatedStatus, setUpdatedStatus] = useState<TeamUsersResponse | null>(
		null
	);

	const { mutate: updateStatus } = useMutation({
		mutationFn: (data: ManageTeamUser) => teamService.updateTeamStatus(data),
		onSuccess: data => {
			setUpdatedStatus(data);
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});

	return { updateStatus, updatedStatus };
}
