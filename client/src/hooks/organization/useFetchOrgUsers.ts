import { orgService } from "@/src/services/org.service";
import { OrgUserResponse } from "@/types/org.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchOrgUsers(
	organizationId?: string | null,
	projectId?: string,
	hideFromProject?: boolean
) {
	const { data: orgData } = useQuery({
		queryKey: ["organization users", organizationId],
		queryFn: () =>
			orgService.getOrganizationUsers(
				organizationId as string,
				projectId,
				hideFromProject
			),
		enabled: !!organizationId,
	});

	const [organizationUserList, setOrganizationUserList] = useState<
		OrgUserResponse[] | undefined
	>(orgData);

	useEffect(() => {
		setOrganizationUserList(orgData);
	}, [orgData]);

	return { organizationUserList, setOrganizationUserList };
}
