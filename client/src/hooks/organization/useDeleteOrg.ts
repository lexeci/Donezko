import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { orgService } from "@/src/services/org.service";

export function useDeleteOrg() {
	const queryClient = useQueryClient();
	const [deletedOrganizationId, setDeletedOrganizationId] = useState<string | null>(null);

	const { mutate: deleteOrganization } = useMutation({
		mutationFn: (id: string) => orgService.deleteOrganization(id),
		onSuccess: (_, id) => {
			setDeletedOrganizationId(id);
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});

	return { deleteOrganization, deletedOrganizationId };
}
