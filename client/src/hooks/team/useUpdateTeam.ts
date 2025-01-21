import { teamService } from "@/src/services/team.service";
import { TeamFormData, TeamResponse } from "@/types/team.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useUpdateTeam() {
	const queryClient = useQueryClient();
	const [updatedTeam, setUpdatedTeam] = useState<TeamResponse | undefined>(
		undefined
	);

	const { mutate: updateTeam, isPending } = useMutation({
		mutationKey: ["Update Team"],
		mutationFn: ({
			id,
			data,
			organizationId,
		}: {
			id: string;
			data: TeamFormData;
			organizationId: string;
		}) => teamService.updateTeam(id, data, organizationId),
		onSuccess: data => {
			toast.success("Successfully update team!");
			setUpdatedTeam(data);
		},
	});

	return { updateTeam, updatedTeam, isPending };
}
