import { teamService } from "@/src/services/team.service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useExitFromTeam() {
	const [isExited, setIsExited] = useState<boolean>(false);

	const { mutate: exitFromTeam } = useMutation({
		mutationFn: (id: string) => teamService.exitFromTeam(id),
		onSuccess: () => {
			setIsExited(true);
		},
	});

	return { exitFromTeam, isExited };
}
