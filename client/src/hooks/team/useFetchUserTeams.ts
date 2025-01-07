import {teamService} from "@/src/services/team.service";
import {TeamsResponse} from "@/types/team.types";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchUserTeams() {
    const {data: userTeamsData} = useQuery({
        queryKey: ["userTeams"],
        queryFn: () => teamService.getUserTeams(), // Використання нового сервісу
    });

    const [userTeamList, setUserTeamList] = useState<
        TeamsResponse[] | undefined
    >(userTeamsData);

    useEffect(() => {
        setUserTeamList(userTeamsData);
    }, [userTeamsData]);

    return {userTeamList, setUserTeamList};
}
