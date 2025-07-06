import { orgService } from "@/src/services/org.service";
import { OrgResponse } from "@/types/org.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch the list of organizations.
 *
 * @returns {{
 *   organizationList: OrgResponse[] | undefined;
 *   setOrganizationList: React.Dispatch<React.SetStateAction<OrgResponse[] | undefined>>;
 *   handleRefetch: () => void;
 *   isFetching: boolean;
 *   isFetched: boolean;
 * }}
 */
export function useFetchOrgs() {
  // Local state to store the list of organizations
  const [organizationList, setOrganizationList] = useState<
    OrgResponse[] | undefined
  >(undefined);

  // useQuery to fetch organizations data, no dependencies needed for automatic fetching
  const {
    data: orgData,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["organizations"], // Unique key for this query
    queryFn: () => orgService.getOrganizations(), // API call to fetch organizations
  });

  // Update local state when new organization data is fetched
  useEffect(() => {
    if (orgData) {
      setOrganizationList(orgData);
    }
  }, [orgData]);

  // Function to manually refetch the organizations data
  const handleRefetch = () => {
    refetch();
  };

  // Return the organization list, setter, refetch function, and query status flags
  return {
    organizationList,
    setOrganizationList,
    handleRefetch,
    isFetching,
    isFetched,
  };
}
