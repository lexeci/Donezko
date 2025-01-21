import {projectService} from "@/src/services/project.service";
import {ProjectUsers} from "@/types/project.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchProjectUsers(id: string, organizationId?: string | null) {
    const [projectUsers, setProjectUsers] = useState<ProjectUsers[] | undefined>(
        undefined
    );

    const {data: projectUsersData, refetch, isFetching, isFetched} = useQuery<
        ProjectUsers[] | undefined
    >({
        queryKey: ["project users", id],
        queryFn: () => projectService.getAllProjectUsers(id, organizationId as string),
        enabled: !!organizationId,
    });

    useEffect(() => {
        if (projectUsersData) {
            setProjectUsers(projectUsersData);
        }
    }, [projectUsersData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {projectUsers, setProjectUsers, handleRefetch, isFetching, isFetched};
}
