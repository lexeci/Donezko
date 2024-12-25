import { projectService } from "@/src/services/project.service";
import { ProjectResponse } from "@/types/project.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchProjectById(id: string) {
	const { data: projectData } = useQuery<ProjectResponse | undefined>({
		queryKey: ["project", id],
		queryFn: () => projectService.getProjectById(id),
	});

	const [project, setProject] = useState<ProjectResponse | null>(
		projectData || null
	);

	useEffect(() => {
		if (projectData) {
			setProject(projectData);
		}
	}, [projectData]);

	return { project, setProject };
}
