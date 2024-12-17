import { teamService } from "@/src/services/team.service";
import { ManageTeamData } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useTransferLeadership() {
	const [isLeadershipTransferred, setIsLeadershipTransferred] =
		useState<boolean>(false);

	const { mutate: transferLeadership } = useMutation({
		mutationFn: ({ id, data }: { id: string; data: ManageTeamData }) =>
			teamService.transferLeadership(id, data),
		onSuccess: () => {
			setIsLeadershipTransferred(true);
		},
	});

	return { transferLeadership, isLeadershipTransferred };
}
