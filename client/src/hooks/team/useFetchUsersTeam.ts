import { teamService } from "@/src/services/team.service";
import { TeamUsersResponse } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchUsersTeam({
	organizationId,
	id,
}: {
	organizationId?: string | null;
	id?: string | null;
}) {
	const { data: teamUsersData, refetch } = useQuery({
		queryKey: ["team users"],
		queryFn: () =>
			teamService.getAllTeamUsers({
				organizationId: organizationId as string,
				id: id as string,
			}), // Використання нового сервісу
		enabled: !!organizationId || !!id,
	});

	const [teamUsers, setTeamUsers] = useState<TeamUsersResponse[] | undefined>(
		teamUsersData
	);

	useEffect(() => {
		setTeamUsers(teamUsersData);
	}, [teamUsersData]);

	// Функція для рефетчінгу
	const handleRefetch = () => {
		refetch(); // Викликає повторний запит
	};

	return { teamUsers, setTeamUsers, handleRefetch };
}
