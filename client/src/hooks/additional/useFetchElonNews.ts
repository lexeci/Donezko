import { additionalService } from "@/services/additional.service";
import { ElonNewsResponse } from "@/src/types/additionalApi.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchElonNews() {
	const {
		data: elonNewsData,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["elonNews"],
		queryFn: () => additionalService.getElonNews(),
	});

	const [elonNews, setElonNews] = useState<ElonNewsResponse | null>(
		elonNewsData || null
	);

	useEffect(() => {
		setElonNews(elonNewsData || null);
	}, [elonNewsData]);

	return { elonNews, setElonNews, isLoading, isError };
}
