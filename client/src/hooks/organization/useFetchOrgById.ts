import { orgService } from "@/src/services/org.service";
import { OrgResponse } from "@/types/org.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchOrgById(organizationId: string | null) {
	const { data: orgData } = useQuery({
		queryKey: ["organization", organizationId],
		queryFn: () => orgService.getOrganizationById(organizationId as string),
		enabled: !!organizationId,
	});

	const [organization, setOrganization] = useState<OrgResponse | undefined>(
		orgData
	);

	useEffect(() => {
		setOrganization(orgData);
	}, [orgData]);

	return { organization, setOrganization };
}
