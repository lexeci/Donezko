import { additionalService } from "@/services/additional.service";
import { ElonNewsResponse } from "@/types/additionalApi.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch the latest Elon Musk related news.
 *
 * @returns An object containing:
 *  - elonNews: The fetched news data or undefined if not loaded yet.
 *  - setElonNews: Setter to manually update the news data if needed.
 *  - isLoading: Boolean indicating if the data is currently being fetched.
 *  - isError: Boolean indicating if there was an error during fetching.
 */
export function useFetchElonNews() {
  // Local state to store fetched news data
  const [elonNews, setElonNews] = useState<ElonNewsResponse | undefined>(
    undefined
  );

  // Use React Query to fetch Elon news data
  const {
    data: elonNewsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["elonNews"], // Unique query key
    queryFn: () => additionalService.getElonNews(), // API call function
  });

  // Effect to update local state when data changes
  useEffect(() => {
    if (elonNewsData) {
      setElonNews(elonNewsData);
    }
  }, [elonNewsData]);

  // Return data and query status flags
  return { elonNews, setElonNews, isLoading, isError };
}
