import {projectService} from "@/src/services/project.service";
import {ProjectFormData, ProjectResponse} from "@/types/project.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useUpdateProject() {
    const [updatedProject, setUpdatedProject] = useState<
        ProjectResponse | undefined
    >(undefined);

    const {mutate: updateProject, isPending} = useMutation({
        mutationKey: ['Update project'],
        mutationFn: ({id, data}: { id: string; data: ProjectFormData }) =>
            projectService.updateProject(id, data),
        onSuccess: data => {
            toast.success('Successfully updated project!');
            setUpdatedProject(data);
        },
    });

    return {updateProject, updatedProject, isPending};
}
