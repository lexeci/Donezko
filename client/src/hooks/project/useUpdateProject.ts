import { projectService } from "@/src/services/project.service";
import { ProjectFormData, ProjectResponse } from "@/types/project.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to update a project.
 *
 * Provides a mutation function to update the project,
 * manages the updated project state,
 * and shows a toast notification on success.
 *
 * @returns {{
 *   updateProject: (params: { id: string; data: ProjectFormData }) => void;
 *   updatedProject: ProjectResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useUpdateProject() {
  // State to store the updated project data after a successful update
  const [updatedProject, setUpdatedProject] = useState<
    ProjectResponse | undefined
  >(undefined);

  // useMutation hook handles the update request to the API
  const { mutate: updateProject, isPending } = useMutation({
    mutationKey: ["update project"], // Unique key identifying this mutation
    mutationFn: ({ id, data }: { id: string; data: ProjectFormData }) =>
      projectService.updateProject(id, data),
    onSuccess: (data) => {
      toast.success("Successfully updated project!"); // Show success message
      setUpdatedProject(data); // Save the updated project data in state
    },
  });

  // Return the mutation function, updated project state, and loading status
  return { updateProject, updatedProject, isPending };
}
