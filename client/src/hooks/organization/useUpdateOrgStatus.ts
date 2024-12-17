import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ManageOrgUser, OrgResponse } from "@/types/org.types";
import { orgService } from "@/src/services/org.service";

export function useUpdateOrgStatus() {
	const queryClient = useQueryClient();
	const [updatedStatus, setUpdatedStatus] = useState<OrgResponse | null>(null);

	const { mutate: updateStatus } = useMutation({
		mutationFn: (data: ManageOrgUser) => orgService.updateStatusOrganization(data),
		onSuccess: (data) => {
			setUpdatedStatus(data);
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});

	return { updateStatus, updatedStatus };
}
