import { projectService } from "@/src/services/project.service";
import { OrgUserResponse } from "@/src/types/org.types";
import { ProjectUsers } from "@/src/types/project.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useTransferProjectManager() {
	const queryClient = useQueryClient();
	const [transferredManager, setTransferredManager] = useState<
		ProjectUsers | undefined
	>(undefined);

	const { mutate: transferManager } = useMutation({
		mutationFn: ({
			projectId,
			userId,
		}: {
			projectId: string;
			userId: string;
		}) => projectService.transferProjectManager(projectId, userId),
		onSuccess: data => {
			setTransferredManager(data);
			queryClient.invalidateQueries({ queryKey: ["project"] }); // Інвалідуємо проект
		},
	});

	return { transferManager, transferredManager };
}
