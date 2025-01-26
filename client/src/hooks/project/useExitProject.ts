import { projectService } from "@/src/services/project.service";
import { ProjectResponse } from "@/types/project.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useExitProject() {
	const [exitStatus, setExitStatus] = useState<ProjectResponse | undefined>(
		undefined
	);

	const { mutate: exitProject, isPending } = useMutation({
		mutationKey: ["Exit project"],
		mutationFn: ({
			projectId,
			userId,
			organizationId,
		}: {
			projectId: string;
			userId?: string;
			organizationId: string;
		}) => projectService.exitProject({ id: projectId, userId, organizationId }),
		onSuccess: data => {
			toast.success("Successfully exit project!");
			setExitStatus(data);
		},
	});

	return { exitProject, exitStatus, isPending };
}
