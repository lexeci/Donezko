import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { TaskResponse } from "@/types/task.types";
import { taskService } from "@/src/services/task.service";

/**
 * Custom hook to fetch tasks filtered by organization, project, team, and availability.
 *
 * @param {object} params - Filter parameters
 * @param {string | null | undefined} params.organizationId - ID of the organization (required to enable query)
 * @param {string | null | undefined} params.projectId - ID of the project (required to enable query)
 * @param {string | null | undefined} params.teamId - ID of the team (optional)
 * @param {boolean} [params.available=false] - Filter to only available tasks
 *
 * @returns {{
 *   taskList: TaskResponse[] | undefined;
 *   setTaskList: React.Dispatch<React.SetStateAction<TaskResponse[] | undefined>>;
 *   handleRefetch: () => void;
 *   isFetching: boolean;
 *   isFetched: boolean;
 * }}
 */
export function useFetchTasks({
  organizationId,
  projectId,
  teamId,
  available = false,
}: {
  organizationId?: string | null;
  projectId?: string | null;
  teamId?: string | null;
  available?: boolean;
}) {
  // Local state to store the fetched tasks
  const [taskList, setTaskList] = useState<TaskResponse[] | undefined>(
    undefined
  );

  // React Query to fetch tasks from the server with given filters
  const {
    data: tasksData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["tasks", projectId, teamId, available],
    queryFn: () =>
      taskService.getTasks({
        organizationId,
        projectId,
        teamId,
        available,
      }),
    enabled: !!organizationId && !!projectId, // Enable only if organizationId and projectId exist
  });

  // Update local task list whenever fetched data changes
  useEffect(() => {
    setTaskList(tasksData);
  }, [tasksData]);

  // Helper function to trigger a manual refetch of tasks
  const handleRefetch = () => {
    refetch();
  };

  return { taskList, setTaskList, handleRefetch, isFetching, isFetched };
}
