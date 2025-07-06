import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { UserFormType } from "@/types/auth.types";
import { userService } from "@/services/user.service";

/**
 * Custom React hook for updating the user's profile information.
 *
 * This hook uses React Query's `useMutation` to send profile updates to the server
 * via `userService.update()`. It provides mutation state and updated user data.
 *
 * Features:
 * - Uses React Query for cache management and mutation handling.
 * - Displays a success toast message on successful update.
 * - Caches the updated user data in local state (`updatedUser`).
 *
 * @returns {{
 *   mutate: (data: UserFormType) => void,
 *   updatedUser: any | undefined,
 *   isPending: boolean
 * }} - Returns the mutation function, updated user data, and pending state.
 *
 * @example
 * const { mutate, updatedUser, isPending } = useUpdateUser();
 *
 * // Trigger update
 * mutate({ email: "new@email.com", name: "New Name" });
 *
 * // Access updated user data
 * console.log(updatedUser);
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const [updatedUser, setUpdatedUser] = useState<any | undefined>(undefined);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update profile"],
    mutationFn: (data: UserFormType) => userService.update(data),
    onSuccess(data) {
      toast.success("Successfully update profile!");
      setUpdatedUser(data);
    },
  });

  return { mutate, updatedUser, isPending };
}
