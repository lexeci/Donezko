import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { OrgFormData, OrgResponse } from "@/types/org.types";
import { orgService } from "@/src/services/org.service";

export function useUpdateOrg() {
	const queryClient = useQueryClient();
	const [updatedOrganization, setUpdatedOrganization] = useState<OrgResponse | null>(null);

	const { mutate: updateOrganization } = useMutation({
		mutationFn: ({ id, data }: { id: string; data: OrgFormData }) =>
			orgService.updateOrganization(id, data),
		onSuccess: (data) => {
			setUpdatedOrganization(data);
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});

	return { updateOrganization, updatedOrganization };
}
