import { projectService } from "@/src/services/project.service";
import { OrgUserResponse } from "@/types/org.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useAddProjectUser() {
	const [addedUser, setAddedUser] = useState<OrgUserResponse | undefined>(
		undefined
	);

	const { mutate: addUser, isPending } = useMutation({
		mutationKey: ["Add user to project"],
		mutationFn: ({
			projectId,
			userId,
			organizationId,
		}: {
			projectId: string;
			userId: string;
			organizationId: string;
		}) =>
			projectService.addUserToProject({
				id: projectId,
				userId,
				organizationId,
			}),
		onSuccess: data => {
			toast.success("Successfully added user!");
			setAddedUser(data);
		},
	});

	return { addUser, addedUser, isPending };
}
