import { orgService } from "@/src/services/org.service";
import { ManageOrgUser, OrgResponse, OrgUserResponse } from "@/types/org.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useUpdateOrgRole() {
	const queryClient = useQueryClient();
	const [updatedRole, setUpdatedRole] = useState<OrgUserResponse | null>(null);

	const { mutate: updateRole } = useMutation({
		mutationFn: (data: ManageOrgUser) =>
			orgService.updateRoleOrganization(data),
		onSuccess: data => {
			setUpdatedRole(data);
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});
	return { updateRole, updatedRole };
}
