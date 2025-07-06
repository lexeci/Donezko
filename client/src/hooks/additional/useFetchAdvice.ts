import { additionalService } from "@/services/additional.service"; // Import the service responsible for API calls
import { AdviceResponse } from "@/types/additionalApi.types"; // Type definition for the advice response
import { useQuery } from "@tanstack/react-query"; // React Query for data fetching
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch advice data from the API.
 *
 * @returns An object containing:
 *  - advice: The current advice data (or undefined if not yet fetched).
 *  - setAdvice: Setter function to manually update the advice state.
 *  - isLoading: Boolean indicating if the query is currently loading.
 *  - isError: Boolean indicating if the query has encountered an error.
 */
export function useFetchAdvice() {
  // Local state to store the fetched advice
  const [advice, setAdvice] = useState<AdviceResponse | undefined>(undefined);

  // React Query hook to fetch advice data
  const {
    data: adviceData, // The data returned from the query
    isLoading, // Loading status of the query
    isError, // Error status of the query
  } = useQuery({
    queryKey: ["advice"], // Unique key for caching and refetching
    queryFn: () => additionalService.getAdvice(), // Function to fetch advice data from API
  });

  // Update local state whenever new advice data arrives
  useEffect(() => {
    if (adviceData) {
      setAdvice(adviceData);
    }
  }, [adviceData]);

  // Return the advice data and query status flags
  return { advice, setAdvice, isLoading, isError };
}
