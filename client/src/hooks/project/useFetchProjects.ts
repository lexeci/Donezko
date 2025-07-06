import { projectService } from "@/src/services/project.service";
import { Project } from "@/types/project.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch projects for a given organization.
 *
 * @param organizationId - The ID of the organization to fetch projects for.
 *
 * @returns {{
 *   projects: Project[] | undefined;
 *   setProjects: React.Dispatch<React.SetStateAction<Project[] | undefined>>;
 *   handleRefetch: () => void;
 *   isFetching: boolean;
 *   isFetched: boolean;
 * }}
 */
export function useFetchProjects(organizationId: string | null) {
  // Local state to store the list of projects
  const [projects, setProjects] = useState<Project[] | undefined>(undefined);

  // Use React Query to fetch projects data
  const {
    data: projectsData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery<Project[] | undefined>({
    queryKey: ["projects", organizationId], // Unique key to cache projects per organization
    queryFn: () => projectService.getAllProjects(organizationId as string), // Fetch projects from API
    enabled: !!organizationId, // Only fetch if organizationId is provided
  });

  // Update local projects state when the query data changes
  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  // Function to manually trigger a refetch of projects data
  const handleRefetch = () => {
    refetch();
  };

  // Return the projects data, setter, refetch function, and loading states
  return { projects, setProjects, handleRefetch, isFetching, isFetched };
}
