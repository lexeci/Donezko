import { projectService } from "@/src/services/project.service";
import { ProjectRole } from "@/types/project.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchProjectRole(
	projectId: string | undefined,
	organizationId?: string | null
) {
	const [projectRole, setProjectRole] = useState<ProjectRole | undefined>(
		undefined
	);

	const {
		data: projectRoleData,
		refetch,
		isFetching,
		isFetched,
	} = useQuery<ProjectRole | undefined>({
		queryKey: ["project user role", projectId],
		queryFn: () =>
			projectService.getProjectRole(
				projectId as string,
				organizationId as string
			),
		enabled: !!projectId && !!organizationId,
	});

	useEffect(() => {
		if (projectRoleData) {
			setProjectRole(projectRoleData);
		}
	}, [projectRoleData]);

	// Функція для рефетчінгу
	const handleRefetch = () => {
		refetch(); // Викликає повторний запит
	};

	return { projectRole, setProjectRole, handleRefetch, isFetching, isFetched };
}
