import { teamService } from "@/src/services/team.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useTeamRemoval() {
	const queryClient = useQueryClient();
	const [isDeleted, setIsDeleted] = useState<boolean>(false);

	const { mutate: deleteTeam } = useMutation({
		mutationFn: ({
			teamId,
			organizationId,
		}: {
			teamId: string;
			organizationId: string;
		}) => teamService.deleteTeam(teamId, organizationId),
		onSuccess: () => {
			setIsDeleted(true);
			queryClient.invalidateQueries({ queryKey: ["teams"] }); // Інвалідуємо список проектів
		},
	});

	return { deleteTeam, isDeleted };
}
