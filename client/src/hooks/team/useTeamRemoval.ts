import { teamService } from "@/src/services/team.service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useTeamRemoval() {
	const [isDeleted, setIsDeleted] = useState<boolean>(false);

	const { mutate: deleteTeam } = useMutation({
		mutationFn: (id: string) => teamService.deleteTeam(id),
		onSuccess: () => {
			setIsDeleted(true);
		},
	});

	return { isDeleted, deleteTeam, setIsDeleted };
}
