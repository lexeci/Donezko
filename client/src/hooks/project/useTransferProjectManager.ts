import { projectService } from "@/src/services/project.service";
import { ProjectUsers } from "@/types/project.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useTransferProjectManager() {
	const [transferredManager, setTransferredManager] = useState<
		ProjectUsers | undefined
	>(undefined);

	const { mutate: transferManager, isPending } = useMutation({
		mutationKey: ["Transfer project leadership"],
		mutationFn: ({
			projectId,
			userId,
			organizationId,
		}: {
			projectId: string;
			userId: string;
			organizationId: string;
		}) => projectService.transferProjectManager(
            {id: projectId, userId, organizationId
    }),
		onSuccess: data => {
			toast.success("Successfully transferred leadership of project!");
			setTransferredManager(data);
		},
	});

	return { transferManager, transferredManager, isPending };
}
