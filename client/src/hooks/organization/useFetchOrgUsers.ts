import { orgService } from "@/src/services/org.service";
import { OrgUserResponse } from "@/types/org.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface useFetchOrgUsers {
	organizationId?: string | null;
	projectId?: string;
	teamId?: string;
	hideFromProject?: boolean;
	hideFromTeam?: boolean;
}

export function useFetchOrgUsers({
	organizationId,
	projectId,
	teamId,
	hideFromProject,
	hideFromTeam,
}: useFetchOrgUsers) {
	const { data: orgData } = useQuery({
		queryKey: ["organization users", organizationId],
		queryFn: () =>
			orgService.getOrganizationUsers(
				organizationId as string,
				projectId,
				hideFromProject,
				teamId,
				hideFromTeam
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
