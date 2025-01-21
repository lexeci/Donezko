import {additionalService} from "@/services/additional.service"; // Шлях до вашого сервісу
import {AdviceResponse} from "@/types/additionalApi.types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export function useFetchAdvice() {
    const [advice, setAdvice] = useState<AdviceResponse | undefined>(
        undefined
    );

    const {
        data: adviceData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["advice"],
        queryFn: () => additionalService.getAdvice(),
    });

    useEffect(() => {
        if (adviceData) {
            setAdvice(adviceData);
        }
    }, [adviceData]);

    return {advice, setAdvice, isLoading, isError};
}
