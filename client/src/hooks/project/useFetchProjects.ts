import {projectService} from "@/src/services/project.service";
import {Project} from "@/types/project.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchProjects(organizationId: string | null) {
    const [projects, setProjects] = useState<Project[] | undefined>(undefined);

    const {data: projectsData, refetch, isFetching, isFetched} = useQuery<Project[] | undefined>({
        queryKey: ["projects", organizationId],
        queryFn: () => projectService.getAllProjects(organizationId as string),
        enabled: !!organizationId,
    });

    useEffect(() => {
        if (projectsData) {
            setProjects(projectsData);
        }
    }, [projectsData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {projects, setProjects, handleRefetch, isFetching, isFetched};
}
