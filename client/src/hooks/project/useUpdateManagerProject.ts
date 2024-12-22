
import { orgService } from "@/src/services/org.service";
import { projectService } from "@/src/services/project.service";
import { ProjectUsers } from "@/src/types/project.types";
import { OrgResponse, OrgUserResponse } from "@/types/org.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useUpdateManagerProject() {
	const queryClient = useQueryClient();
	const [updatedManager, setUpdatedManager] = useState<ProjectUsers | null>(null);

	const { mutate: updateOwner } = useMutation({
		mutationFn: ({ id, userId }: { id: string; userId: string }) =>
			projectService.useUpdateManager(id, userId),
		onSuccess: data => {
			setUpdatedManager(data);
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});

	return { updateOwner, updatedManager };
}
