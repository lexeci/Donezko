import { projectService } from "@/src/services/project.service";
import { OrgUserResponse } from "@/types/org.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useRemoveProjectUser() {
	const [removedUser, setRemovedUser] = useState<OrgUserResponse | undefined>(
		undefined
	);

	const { mutate: removeUser, isPending } = useMutation({
		mutationKey: ["Remove project user"],
		mutationFn: ({
			projectId,
			userId,
			organizationId,
		}: {
			projectId: string;
			userId: string;
			organizationId: string;
		}) =>
			projectService.removeUserToProject({
				id: projectId,
				userId,
				organizationId,
			}),
		onSuccess: data => {
			toast.success("Successfully removed user from project!");
			setRemovedUser(data);
		},
	});

	return { removeUser, removedUser, isPending };
}
