import { projectService } from "@/src/services/project.service";
import { ProjectFormData } from "@/types/project.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useCreateProject() {
	const queryClient = useQueryClient();
	const [createdProject, setCreatedProject] = useState<any | undefined>(
		undefined
	);

	const { mutate: createProject } = useMutation({
		mutationFn: (data: ProjectFormData) => projectService.createProject(data),
		onSuccess: data => {
			setCreatedProject(data);
			queryClient.invalidateQueries({ queryKey: ["projects"] }); // Інвалідуємо список проектів
		},
	});

	return { createProject, createdProject };
}
