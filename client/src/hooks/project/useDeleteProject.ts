import { projectService } from "@/src/services/project.service";
import { ProjectResponse } from "@/types/project.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to handle deleting a project.
 *
 * @returns {{
 *   deleteProject: (params: { projectId: string; organizationId: string }) => void;
 *   deletedProject: ProjectResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useDeleteProject() {
  // State to store the project data returned after successful deletion
  const [deletedProject, setDeletedProject] = useState<
    ProjectResponse | undefined
  >(undefined);

  // React Query mutation to delete a project using projectService
  const { mutate: deleteProject, isPending } = useMutation({
    mutationKey: ["Delete project"], // Unique mutation key
    mutationFn: ({
      projectId,
      organizationId,
    }: {
      projectId: string;
      organizationId: string;
    }) => projectService.deleteProject(projectId, organizationId),
    onSuccess: (data) => {
      toast.success("Successfully deleted project!"); // Show success notification
      setDeletedProject(data); // Save deleted project data in state
    },
  });

  // Return the mutation function, deleted project state, and loading status
  return { deleteProject, deletedProject, isPending };
}
