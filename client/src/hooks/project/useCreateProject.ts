import {projectService} from "@/src/services/project.service";
import {ProjectFormData, ProjectResponse} from "@/types/project.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useCreateProject() {
    const [createdProject, setCreatedProject] = useState<ProjectResponse | undefined>(
        undefined
    );

    const {mutate: createProject, isPending} = useMutation({
        mutationKey: ['Create project'],
        mutationFn: (data: ProjectFormData) => projectService.createProject(data),
        onSuccess: data => {
            toast.success('Successfully created project!');
            setCreatedProject(data);
        },
    });

    return {createProject, createdProject, isPending};
}
