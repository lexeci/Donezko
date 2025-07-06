import { projectService } from "@/src/services/project.service";
import { ProjectUsers } from "@/types/project.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch and manage the list of users assigned to a project.
 *
 * @param id - Project ID for which to fetch users.
 * @param organizationId - Optional organization ID to scope the request.
 *
 * @returns {{
 *   projectUsers: ProjectUsers[] | undefined;
 *   setProjectUsers: React.Dispatch<React.SetStateAction<ProjectUsers[] | undefined>>;
 *   handleRefetch: () => void;
 *   isFetching: boolean;
 *   isFetched: boolean;
 * }}
 */
export function useFetchProjectUsers(
  id: string,
  organizationId?: string | null
) {
  // Local state to store the fetched project users
  const [projectUsers, setProjectUsers] = useState<ProjectUsers[] | undefined>(
    undefined
  );

  // React Query hook to fetch project users from the API
  const {
    data: projectUsersData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery<ProjectUsers[] | undefined>({
    queryKey: ["project users", id], // Unique query key for caching
    queryFn: () =>
      projectService.getAllProjectUsers(id, organizationId as string),
    enabled: !!organizationId, // Only run query if organizationId is truthy
  });

  // Effect to update local state when query data changes
  useEffect(() => {
    if (projectUsersData) {
      setProjectUsers(projectUsersData);
    }
  }, [projectUsersData]);

  // Function to manually trigger refetching of the project users list
  const handleRefetch = () => {
    refetch();
  };

  // Return state, setter, refetch function, and loading status
  return {
    projectUsers,
    setProjectUsers,
    handleRefetch,
    isFetching,
    isFetched,
  };
}
