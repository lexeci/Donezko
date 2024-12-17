import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TimeBlockFormValues } from "@/types/time-block.types";

import { timeBlockService } from "@/services/time-block.service";

export function useCreateBlock() {
	const queryClient = useQueryClient();

	const { mutate: createBlock, isPending } = useMutation({
		mutationKey: ["create time-block"],
		mutationFn: (data: TimeBlockFormValues) =>
			timeBlockService.createBlock(data),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ["time-blocks"],
			});
		},
	});

	return {
		createBlock,
		isPending,
	};
}
