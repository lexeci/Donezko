import { teamService } from "@/src/services/team.service";
import { ManageTeamUser } from "@/types/team.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useTransferLeadership() {
	const [isLeadershipTransferred, setIsLeadershipTransferred] =
		useState<boolean>(false);

	const { mutate: transferLeadership } = useMutation({
		mutationFn: (data: ManageTeamUser) =>
			teamService.transferLeadership(data),
		onSuccess: () => {
			setIsLeadershipTransferred(true);
		},
	});

	return { transferLeadership, isLeadershipTransferred };
}
