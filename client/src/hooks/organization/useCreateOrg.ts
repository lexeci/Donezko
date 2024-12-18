import { orgService } from "@/src/services/org.service";
import { Organization, OrgFormData } from "@/types/org.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useCreateOrg() {
	const queryClient = useQueryClient();
	const [newOrganization, setNewOrganization] = useState<Organization | null>(
		null
	);

	const { mutate: createOrganization } = useMutation({
		mutationFn: (data: OrgFormData) => orgService.createOrganization(data),
		onSuccess: data => {
			setNewOrganization(data);
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});

	return { createOrganization, newOrganization };
}
