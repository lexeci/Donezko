import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { orgService } from "@/src/services/org.service";

export function useExitOrg() {
	const queryClient = useQueryClient();
	const [exitedOrganizationId, setExitedOrganizationId] = useState<string | null>(null);

	const { mutate: exitOrganization } = useMutation({
		mutationFn: (id: string) => orgService.exitOrganization(id),
		onSuccess: (_, id) => {
			setExitedOrganizationId(id);
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});

	return { exitOrganization, exitedOrganizationId };
}
