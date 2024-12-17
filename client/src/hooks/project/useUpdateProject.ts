import { projectService } from "@/src/services/project.service";
import { ProjectFormData, ProjectResponse } from "@/src/types/project.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useUpdateProjectUser() {
	const queryClient = useQueryClient();
	const [updatedProject, setUpdatedProject] = useState<
		ProjectResponse | undefined
	>(undefined);

	const { mutate: updateProject } = useMutation({
		mutationFn: ({ id, data }: { id: string; data: ProjectFormData }) =>
			projectService.updateProject(id, data),
		onSuccess: data => {
			setUpdatedProject(data);
			queryClient.invalidateQueries({ queryKey: ["project"] }); // Інвалідуємо проект
		},
	});

	return { updateProject, updatedProject };
}
