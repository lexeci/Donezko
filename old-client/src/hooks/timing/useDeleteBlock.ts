import { useMutation, useQueryClient } from "@tanstack/react-query";

import { timeBlockService } from "@/services/time-block.service";

export function useDeleteBlock(itemId: string) {
	const queryClient = useQueryClient();

	const { mutate: deleteBlock, isPending: isDeletePending } = useMutation({
		mutationKey: ["delete time-block", itemId],
		mutationFn: () => timeBlockService.deleteBlock(itemId),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ["time-blocks"],
			});
		},
	});

	return { deleteBlock, isDeletePending };
}
