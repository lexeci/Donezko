import { projectService } from "@/src/services/project.service";
import { ProjectFormData, ProjectResponse } from "@/types/project.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to create a new project using the projectService.
 *
 * @returns {{
 *   createProject: (data: ProjectFormData) => void;
 *   createdProject: ProjectResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useCreateProject() {
  // State to hold the newly created project data after a successful mutation
  const [createdProject, setCreatedProject] = useState<
    ProjectResponse | undefined
  >(undefined);

  // useMutation hook to perform the create project operation
  const { mutate: createProject, isPending } = useMutation({
    mutationKey: ["Create project"], // Unique key to identify this mutation
    mutationFn: (data: ProjectFormData) => projectService.createProject(data), // API call to create the project
    onSuccess: (data) => {
      toast.success("Successfully created project!"); // Show success notification
      setCreatedProject(data); // Update state with created project data
    },
  });

  // Return the mutation function, created project state, and loading status
  return { createProject, createdProject, isPending };
}
