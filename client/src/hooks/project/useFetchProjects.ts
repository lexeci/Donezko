import { projectService } from "@/src/services/project.service";
import { Project, ProjectResponse } from "@/src/types/project.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchProjects(organizationId?: string | null) {
	const { data: projectsData } = useQuery<Project[] | undefined>({
		queryKey: ["projects", organizationId],
		queryFn: () => projectService.getAllProjects(organizationId as string),
		enabled: !!organizationId,
	});

	const [projects, setProjects] = useState<Project[]>(
		projectsData || []
	);

	useEffect(() => {
		if (projectsData) {
			setProjects(projectsData);
		}
	}, [projectsData]);

	return { projects, setProjects };
}
