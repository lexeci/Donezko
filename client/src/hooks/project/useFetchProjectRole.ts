import { projectService } from "@/src/services/project.service";
import { ProjectRole } from "@/types/project.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch the current user's role within a specific project.
 *
 * @param projectId - The ID of the project to fetch the role for.
 * @param organizationId - Optional organization ID for scoping the request.
 *
 * @returns {{
 *   projectRole: ProjectRole | undefined;
 *   setProjectRole: React.Dispatch<React.SetStateAction<ProjectRole | undefined>>;
 *   handleRefetch: () => void;
 *   isFetching: boolean;
 *   isFetched: boolean;
 * }}
 */
export function useFetchProjectRole(
  projectId: string | undefined,
  organizationId?: string | null
) {
  // Local state to store the fetched project role
  const [projectRole, setProjectRole] = useState<ProjectRole | undefined>(
    undefined
  );

  // React Query to fetch the project role from API
  const {
    data: projectRoleData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery<ProjectRole | undefined>({
    queryKey: ["project user role", projectId], // Unique cache key per project
    queryFn: () =>
      projectService.getProjectRole(
        projectId as string,
        organizationId as string
      ),
    enabled: !!projectId && !!organizationId, // Only fetch if both IDs exist
  });

  // Update local state when data changes
  useEffect(() => {
    if (projectRoleData) {
      setProjectRole(projectRoleData);
    }
  }, [projectRoleData]);

  // Function to manually trigger a refetch of project role
  const handleRefetch = () => {
    refetch();
  };

  // Return role data, setter, refetch function, and loading flags
  return { projectRole, setProjectRole, handleRefetch, isFetching, isFetched };
}
