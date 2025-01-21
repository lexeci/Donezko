import {projectService} from "@/src/services/project.service";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";
import {ProjectResponse} from "@/types/project.types";

export function useExitProject() {
    const [exitStatus, setExitStatus] = useState<ProjectResponse | undefined>(undefined);

    const {mutate: exitProject, isPending} = useMutation({
        mutationKey: ['Exit project'],
        mutationFn: (
            {
                projectId,
                userId,
            }: {
                projectId: string;
                userId?: string;
            }) => projectService.exitProject(projectId, userId),
        onSuccess: data => {
            toast.success('Successfully exit project!');
            setExitStatus(data);
        },
    });

    return {exitProject, exitStatus, isPending};
}
