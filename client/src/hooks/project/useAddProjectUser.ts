import { projectService } from "@/src/services/project.service";
import { OrgUserResponse } from "@/src/types/org.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useAddProjectUser() {
	const queryClient = useQueryClient();
	const [addedUser, setAddedUser] = useState<OrgUserResponse | undefined>(undefined);

	const { mutate: addUser } = useMutation({
		mutationFn: ({
			projectId,
			userId,
		}: {
			projectId: string;
			userId: string;
		}) => projectService.addUserToProject(projectId, userId),
		onSuccess: data => {
			setAddedUser(data);
			queryClient.invalidateQueries({ queryKey: ["project"] }); // Інвалідуємо проект
		},
	});

	return { addUser, addedUser };
}
