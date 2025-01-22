import { orgService } from "@/src/services/org.service";
import { OrgResponse } from "@/types/org.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchOrgById(organizationId: string | null) {
	const [organization, setOrganization] = useState<OrgResponse | undefined>(
		undefined
	);

	const {
		data: orgData,
		refetch,
		isFetching,
		isFetched,
	} = useQuery({
		queryKey: ["organization", organizationId],
		queryFn: () => orgService.getOrganizationById(organizationId as string),
		enabled: !!organizationId,
	});

	useEffect(() => {
		if (orgData) {
			setOrganization(orgData);
		}
	}, [orgData]);

	// Функція для рефетчінгу
	const handleRefetch = () => {
		refetch(); // Викликає повторний запит
	};

	return {
		organization,
		setOrganization,
		handleRefetch,
		isFetching,
		isFetched,
	};
}
