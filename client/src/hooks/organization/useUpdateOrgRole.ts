import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ManageOrgUser, OrgResponse } from "@/types/org.types";
import { orgService } from "@/src/services/org.service";

export function useUpdateOrgRole() {
	const queryClient = useQueryClient();
	const [updatedRole, setUpdatedRole] = useState<OrgResponse | null>(null);

	const { mutate: updateRole } = useMutation({
		mutationFn: (data: ManageOrgUser) => orgService.updateRoleOrganization(data),
		onSuccess: (data) => {
			setUpdatedRole(data);
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});

	return { updateRole, updatedRole };
}
