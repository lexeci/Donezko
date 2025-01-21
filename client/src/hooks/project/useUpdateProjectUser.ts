import { projectService } from "@/src/services/project.service";
import { ProjectResponse } from "@/types/project.types";
import { AccessStatus } from "@/types/root.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useUpdateProjectUser() {
	const [updatedStatus, setUpdatedStatus] = useState<
		ProjectResponse | undefined
	>(undefined);

	const { mutate: updateStatus, isPending } = useMutation({
		mutationKey: ["Update project user"],
		mutationFn: ({
			projectId,
			userId,
			status,
			organizationId,
		}: {
			projectId: string;
			userId: string;
			status: AccessStatus;
			organizationId: string;
		}) =>
			projectService.updateUserStatus({
				id: projectId,
				userId,
				status,
				organizationId,
			}),
		onSuccess: data => {
			toast.success("Successfully updated project user!");
			setUpdatedStatus(data);
		},
	});

	return { updateStatus, updatedStatus, isPending };
}
