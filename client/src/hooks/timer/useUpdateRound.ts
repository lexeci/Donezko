import { useMutation, useQueryClient } from "@tanstack/react-query";

import { timerService } from "@/services/timer.service";
import { TypeTimerRoundState } from "@/types/timer.types";
import { useState } from "react";

export function useUpdateRound() {
	const [updatedRound, setUpdatedRound] = useState<boolean | undefined>(
		undefined
	);
	const queryClient = useQueryClient();

	const { mutate: updateRound, isPending: isUpdateRoundPending } = useMutation({
		mutationKey: ["update round"],
		mutationFn: ({ id, data }: { id: string; data: TypeTimerRoundState }) =>
			timerService.updateRound(id, data),
		onSuccess(data) {
			queryClient.invalidateQueries({ queryKey: ["get today session"] });
			setUpdatedRound(data);
		},
	});

	return { updateRound, updatedRound, isUpdateRoundPending };
}
