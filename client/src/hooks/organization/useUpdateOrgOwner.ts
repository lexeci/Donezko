import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { OrgResponse } from "@/types/org.types";
import { orgService } from "@/src/services/org.service";

export function useUpdateOrgOwner() {
	const queryClient = useQueryClient();
	const [updatedOwner, setUpdatedOwner] = useState<OrgResponse | null>(null);

	const { mutate: updateOwner } = useMutation({
		mutationFn: ({ id, orgUserId }: { id: string; orgUserId: string }) =>
			orgService.updateOwnerOrganization(id, orgUserId),
		onSuccess: (data) => {
			setUpdatedOwner(data);
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});

	return { updateOwner, updatedOwner };
}
