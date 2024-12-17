import { projectService } from "@/src/services/project.service";
import { ProjectUsers } from "@/src/types/project.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchProjectUsers(id: string) {
	const { data: projectUsersData } = useQuery<ProjectUsers[] | undefined>({
		queryKey: ["project users", id],
		queryFn: () => projectService.getAllProjectUsers(id),
	});

	const [projectUsers, setProjectUsers] = useState<ProjectUsers[]>(
		projectUsersData || []
	);

	useEffect(() => {
		if (projectUsersData) {
			setProjectUsers(projectUsersData);
		}
	}, [projectUsersData]);

	return { projectUsers, setProjectUsers };
}
