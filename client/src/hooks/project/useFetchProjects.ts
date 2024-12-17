import { projectService } from "@/src/services/project.service";
import { Project, ProjectResponse } from "@/src/types/project.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchProjects(organizationId?: string) {
	const { data: projectsData } = useQuery<ProjectResponse[] | undefined>({
		queryKey: ["projects", organizationId],
		queryFn: () => projectService.getAllProjects(organizationId),
	});

	const [projects, setProjects] = useState<ProjectResponse[]>(projectsData || []);

	useEffect(() => {
		if (projectsData) {
			setProjects(projectsData);
		}
	}, [projectsData]);

	return { projects, setProjects };
}
