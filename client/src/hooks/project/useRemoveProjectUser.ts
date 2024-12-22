import { projectService } from "@/src/services/project.service";
import { OrgUserResponse } from "@/src/types/org.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useRemoveProjectUser() {
	const queryClient = useQueryClient();
	const [removedUser, setRemovedUser] = useState<OrgUserResponse | undefined>(
		undefined
	);

	const { mutate: removeUser } = useMutation({
		mutationFn: ({
			projectId,
			userId,
		}: {
			projectId: string;
			userId: string;
		}) => projectService.removeUserToProject(projectId, userId),
		onSuccess: data => {
			setRemovedUser(data);
			queryClient.invalidateQueries({ queryKey: ["project"] }); // Інвалідуємо проект
		},
	});

	return { removeUser, removedUser };
}
