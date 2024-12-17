import { projectService } from "@/src/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useExitProject() {
	const queryClient = useQueryClient();
	const [exitStatus, setExitStatus] = useState<any | undefined>(undefined);

	const { mutate: exitProject } = useMutation({
		mutationFn: ({
			projectId,
			userId,
		}: {
			projectId: string;
			userId?: string;
		}) => projectService.exitProject(projectId, userId),
		onSuccess: data => {
			setExitStatus(data);
			queryClient.invalidateQueries({ queryKey: ["projects"] }); // Інвалідуємо список проектів
		},
	});

	return { exitProject, exitStatus };
}
