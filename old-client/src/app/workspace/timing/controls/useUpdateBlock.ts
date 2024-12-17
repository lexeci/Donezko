import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TimeBlockFormValues } from "@/types/time-block.types";

import { timeBlockService } from "@/services/time-block.service";

export function useUpdateBlock(key?: string) {
	const queryClient = useQueryClient();

	const { mutate: updateBlock } = useMutation({
		mutationKey: ["update time-block", key],
		mutationFn: ({ id, data }: { id: string; data: TimeBlockFormValues }) =>
			timeBlockService.updateBlock(id, data),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ["time-blocks"],
			});
		},
	});

	return { updateBlock };
}
