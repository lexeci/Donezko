import { projectService } from "@/src/services/project.service";
import { ProjectResponse } from "@/types/project.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook to fetch a project by its ID within an organization.
 *
 * @param id - The ID of the project to fetch.
 * @param organizationId - Optional organization ID to scope the request.
 *
 * @returns {{
 *   project: ProjectResponse | undefined;
 *   setProject: React.Dispatch<React.SetStateAction<ProjectResponse | undefined>>;
 *   handleRefetch: () => void;
 *   isFetching: boolean;
 *   isFetched: boolean;
 * }}
 */
export function useFetchProjectById(
  id: string,
  organizationId?: string | null
) {
  // Local state to store the fetched project data
  const [project, setProject] = useState<ProjectResponse | undefined>(
    undefined
  );

  // React Query to fetch project data by ID and organization ID
  const {
    data: projectData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery<ProjectResponse>({
    queryKey: ["project", id], // Unique query key including project ID
    queryFn: () => projectService.getProjectById(id, organizationId as string),
    enabled: !!id && !!organizationId, // Only fetch if both IDs are provided
  });

  // Update local state when fetched data changes
  useEffect(() => {
    if (projectData) {
      setProject(projectData);
    }
  }, [projectData]);

  // Function to manually refetch project data
  const handleRefetch = () => {
    refetch();
  };

  // Return the current project state, setter, refetch function, and status flags
  return { project, setProject, handleRefetch, isFetching, isFetched };
}
