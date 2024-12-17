import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type { TimeBlockResponse } from "@/types/time-block.types";
import { timeBlockService } from "@/services/time-block.service";

export const useTimeBlocks = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["time-blocks"],
		queryFn: () => timeBlockService.getTimeBlocks(),
	});

	const [timeBlocks, setTimeBlocks] = useState<TimeBlockResponse[] | undefined>(
		data
	); // Allowing undefined

	useEffect(() => {
		if (data) {
			setTimeBlocks(data);
		}
	}, [data]);

	return { timeBlocks, setTimeBlocks, isLoading };
};
