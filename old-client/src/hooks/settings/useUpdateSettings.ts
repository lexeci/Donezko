import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { UserFormType } from "@/types/auth.types";

import { userService } from "@/services/user.service";

export function useUpdateSettings() {
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationKey: ["update profile"],
		mutationFn: (data: UserFormType) => userService.update(data),
		onSuccess() {
			toast.success("Your's profile setting successfully updated!");
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});

	return { mutate, isPending };
}
