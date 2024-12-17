import { orgService } from "@/src/services/org.service";
import { OrgResponse } from "@/types/org.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchOrgs() {
	const { data: orgData } = useQuery({
		queryKey: ["organizations"],
		queryFn: () => orgService.getOrganizations(),
	});

	const [organizationList, setOrganizationList] = useState<
		OrgResponse[] | undefined
	>(orgData);

	useEffect(() => {
		setOrganizationList(orgData);
	}, [orgData]);

	return { organizationList, setOrganizationList };
}
