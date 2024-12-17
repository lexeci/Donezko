import { projectService } from "@/src/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useExitProject() {
	const queryClient = useQueryClient();
	const [exitStatus, setExitStatus] = useState<any | undefined>(undefined);

	const { mutate: exitProject } = useMutation({
		mutationFn: (projectId: string) => projectService.exitProject(projectId),
		onSuccess: data => {
			setExitStatus(data);
			queryClient.invalidateQueries({ queryKey: ["projects"] }); // Інвалідуємо список проектів
		},
	});

	return { exitProject, exitStatus };
}
