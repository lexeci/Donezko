import { projectService } from "@/src/services/project.service";
import { ProjectResponse } from "@/types/project.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to handle the process of a user exiting a project.
 *
 * @returns {{
 *   exitProject: (params: { projectId: string; userId?: string; organizationId: string }) => void;
 *   exitStatus: ProjectResponse | undefined;
 *   isPending: boolean;
 * }}
 */
export function useExitProject() {
  // Local state to store the result of the exit project mutation
  const [exitStatus, setExitStatus] = useState<ProjectResponse | undefined>(
    undefined
  );

  // React Query mutation to call the exitProject API endpoint
  const { mutate: exitProject, isPending } = useMutation({
    mutationKey: ["Exit project"], // Unique mutation key for caching and tracking
    mutationFn: ({
      projectId,
      userId,
      organizationId,
    }: {
      projectId: string;
      userId?: string; // Optional userId, defaults to current user if omitted
      organizationId: string;
    }) => projectService.exitProject({ id: projectId, userId, organizationId }),
    onSuccess: (data) => {
      toast.success("Successfully exited project!"); // Notify user on success
      setExitStatus(data); // Update local state with response data
    },
  });

  // Return the mutation function, current status, and loading state
  return { exitProject, exitStatus, isPending };
}
