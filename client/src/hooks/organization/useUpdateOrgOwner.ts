import { orgService } from "@/src/services/org.service";
import { OrgResponse, OrgUserResponse } from "@/types/org.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useUpdateOrgOwner() {
	const queryClient = useQueryClient();
	const [updatedOwner, setUpdatedOwner] = useState<OrgUserResponse | null>(null);

	const { mutate: updateOwner } = useMutation({
		mutationFn: ({ id, orgUserId }: { id: string; orgUserId: string }) =>
			orgService.updateOwnerOrganization(id, orgUserId),
		onSuccess: data => {
			setUpdatedOwner(data);
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});

	return { updateOwner, updatedOwner };
}
