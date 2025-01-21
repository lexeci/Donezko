import { projectService } from "@/src/services/project.service";
import { ProjectResponse } from "@/types/project.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useDeleteProject() {
	const [deletedProject, setDeletedProject] = useState<
		ProjectResponse | undefined
	>(undefined);

	const { mutate: deleteProject, isPending } = useMutation({
		mutationKey: ["Delete project"],
		mutationFn: ({
			projectId,
			organizationId,
		}: {
			projectId: string;
			organizationId: string;
		}) => projectService.deleteProject(projectId, organizationId),
		onSuccess: data => {
			toast.success("Successfully deleted project!");
			setDeletedProject(data);
		},
	});

	return { deleteProject, deletedProject, isPending };
}
