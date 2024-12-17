import { projectService } from "@/src/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const [deletedProject, setDeletedProject] = useState<any | undefined>(undefined);

  const { mutate: deleteProject } = useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: data => {
      setDeletedProject(data);
      queryClient.invalidateQueries({ queryKey: ["projects"] }); // Інвалідуємо список проектів
    },
  });

  return { deleteProject, deletedProject };
}
