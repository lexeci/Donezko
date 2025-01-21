import {projectService} from "@/src/services/project.service";
import {ProjectResponse} from "@/types/project.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {toast} from "sonner";

export function useFetchProjectById(id: string, organizationId?: string | null) {
    const [project, setProject] = useState<ProjectResponse | undefined>(
        undefined);

    const {data: projectData, refetch, isFetching, isFetched} = useQuery<ProjectResponse>({
        queryKey: ["project", id],
        queryFn: () => projectService.getProjectById(id, organizationId as string),
        enabled: !!id && !!organizationId,
    });

    useEffect(() => {
        if (projectData) {
            setProject(projectData);
        }
    }, [projectData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {project, setProject, handleRefetch, isFetching, isFetched};
}
