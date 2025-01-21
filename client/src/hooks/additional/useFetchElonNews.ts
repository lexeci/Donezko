import {additionalService} from "@/services/additional.service";
import {ElonNewsResponse} from "@/types/additionalApi.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchElonNews() {
    const [elonNews, setElonNews] = useState<ElonNewsResponse | undefined>(
        undefined
    );

    const {
        data: elonNewsData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["elonNews"],
        queryFn: () => additionalService.getElonNews(),
    });

    useEffect(() => {
        if (elonNewsData) {
            setElonNews(elonNewsData);
        }
    }, [elonNewsData]);

    return {elonNews, setElonNews, isLoading, isError};
}
