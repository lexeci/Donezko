import {projectService} from "@/src/services/project.service";
import {ProjectRole} from "@/types/project.types";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchProjectRole(projectId: string | undefined) {
    const {data: projectRoleData, refetch} = useQuery<
        ProjectRole | undefined
    >({
        queryKey: ["project users", projectId],
        queryFn: () => projectService.getProjectRole(projectId as string),
        enabled: !!projectId,
    });

    const [projectRole, setProjectRole] = useState<ProjectRole | undefined>(
        projectRoleData
    );

    useEffect(() => {
        if (projectRoleData) {
            setProjectRole(projectRoleData);
        }
    }, [projectRoleData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {projectRole, setProjectRole, handleRefetch};
}
