import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { timerService } from "@/services/timer.service";
import { TimerSessionResponse } from "@/src/types/timer.types";

export function useCreateSession() {
	const [createdSession, setCreatedSession] = useState<
		TimerSessionResponse | undefined
	>(undefined);
	const queryClient = useQueryClient();

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ["create new session"],
		mutationFn: () => timerService.createSession(),
		onSuccess(data) {
			queryClient.invalidateQueries({
				queryKey: ["get today session"],
			});
			setCreatedSession(data);
		},
	});

	return { mutate, createdSession, isPending, isSuccess };
}
