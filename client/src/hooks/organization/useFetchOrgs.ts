import {orgService} from "@/src/services/org.service";
import {OrgResponse} from "@/types/org.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchOrgs() {
    const [organizationList, setOrganizationList] = useState<
        OrgResponse[] | undefined
    >(undefined);

    const {data: orgData, refetch, isFetching, isFetched} = useQuery({
        queryKey: ["organizations"],
        queryFn: () => orgService.getOrganizations(),
    });

    useEffect(() => {
        if (orgData) {
            setOrganizationList(orgData);
        }
    }, [orgData]);

    // Функція для рефетчінгу
    const handleRefetch = () => {
        refetch(); // Викликає повторний запит
    };

    return {organizationList, setOrganizationList, handleRefetch, isFetching, isFetched};
}
