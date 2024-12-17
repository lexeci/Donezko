import { additionalService } from "@/services/additional.service"; // Шлях до вашого сервісу
import { AdviceResponse } from "@/src/types/additionalApi.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useFetchAdvice() {
	const {
		data: adviceData,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["advice"],
		queryFn: () => additionalService.getAdvice(),
	});

	const [advice, setAdvice] = useState<AdviceResponse | null>(
		adviceData || null
	);

	useEffect(() => {
		setAdvice(adviceData || null);
	}, [adviceData]);

	return { advice, setAdvice, isLoading, isError };
}
