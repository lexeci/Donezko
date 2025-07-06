import { useMutation, useQueryClient } from "@tanstack/react-query";

import { timerService } from "@/services/timer.service";

/**
 * Custom React hook for deleting a timer session.
 *
 * This hook provides a mutation that deletes a timer session by its ID using `timerService.deleteSession`.
 * After successful deletion, it invalidates the "get today session" query and calls a provided success callback.
 *
 * @param {() => void} onDeleteSuccess - Callback function to be called after successful deletion.
 *
 * @returns {{
 *   deleteSession: (id: string) => void,
 *   isDeleting: boolean
 * }} - Returns the mutation function (`deleteSession`) and a loading state (`isDeleting`).
 *
 * @example
 * const { deleteSession, isDeleting } = useDeleteSession(() => {
 *   console.log('Session deleted successfully!');
 * });
 *
 * deleteSession('abc123'); // Call to delete session with ID "abc123"
 */
export function useDeleteSession(onDeleteSuccess: () => void) {
  const queryClient = useQueryClient();

  const { mutate: deleteSession, isPending: isDeleting } = useMutation({
    mutationKey: ["delete session"],
    mutationFn: (id: string) => timerService.deleteSession(id),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["get today session"],
      });
      onDeleteSuccess();
    },
  });

  return { deleteSession, isDeleting };
}
