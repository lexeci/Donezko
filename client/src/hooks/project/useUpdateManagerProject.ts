import {projectService} from "@/src/services/project.service";
import {ProjectUsers} from "@/types/project.types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export function useUpdateManagerProject() {
    const [updatedManager, setUpdatedManager] = useState<ProjectUsers | undefined>(
        undefined
    );

    const {mutate: updateOwner, isPending} = useMutation({
        mutationKey: ['Transfer project manager'],
        mutationFn: ({id, userId}: { id: string; userId: string }) =>
            projectService.transferProjectManager(id, userId),
        onSuccess: data => {
            toast.success('Successfully transferred manager of project!');
            setUpdatedManager(data);
        },
    });

    return {updateOwner, updatedManager, isPending};
}
