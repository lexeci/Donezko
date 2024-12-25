import { projectService } from "@/src/services/project.service";
import { ProjectResponse } from "@/types/project.types";
import { AccessStatus } from "@/types/root.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useUpdateProjectUser() {
	const queryClient = useQueryClient();
	const [updatedStatus, setUpdatedStatus] = useState<
		ProjectResponse | undefined
	>(undefined);

	const { mutate: updateStatus } = useMutation({
		mutationFn: ({
			projectId,
			userId,
			status,
		}: {
			projectId: string;
			userId: string;
			status: AccessStatus;
		}) => projectService.updateUserStatus(projectId, userId, status),
		onSuccess: data => {
			setUpdatedStatus(data);
			queryClient.invalidateQueries({ queryKey: ["project"] }); // Інвалідуємо проект
		},
	});

	return { updateStatus, updatedStatus };
}
