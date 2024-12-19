import { orgService } from "@/src/services/org.service";
import { OrgRole } from "@/types/org.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchOrgRole(organizationId: string | null) {
	const { data: orgData } = useQuery({
		queryKey: ["organization role", organizationId],
		queryFn: () => orgService.getOrganizationRole(organizationId as string),
		enabled: !!organizationId,
	});

	const [organizationRole, setOrganizationRole] = useState<
		{ role: OrgRole } | undefined
	>(orgData);

	useEffect(() => {
		setOrganizationRole(orgData);
	}, [orgData]);

	return { organizationRole, setOrganizationRole };
}
