import { Dispatch, SetStateAction, useEffect } from "react";
import { UseFormReset } from "react-hook-form";

import { UserFormType } from "@/types/auth.types";
import { useFetchUserProfile } from "@/hooks/user/useFetchUserProfile";

/**
 * Custom React hook for initializing a user form with fetched profile data.
 *
 * This hook fetches the user's profile using `useFetchUserProfile` and resets the form
 * fields once the data is loaded. It also updates the loading state to `false` after initialization.
 *
 * Intended to be used in user profile editing forms.
 *
 * @param {UseFormReset<UserFormType>} reset - Function from `react-hook-form` to reset the form values.
 * @param {Dispatch<SetStateAction<boolean>>} setIsLoading - Setter for loading state (typically used to indicate form readiness).
 *
 * @example
 * const { reset } = useForm<UserFormType>();
 * const [isLoading, setIsLoading] = useState(true);
 * useInitialUserData(reset, setIsLoading);
 *
 * // When `isDataLoaded` is true, the form will be reset and loading will end.
 */
export function useInitialUserData(
  reset: UseFormReset<UserFormType>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) {
  const { profileData: data, isDataLoaded } = useFetchUserProfile();

  useEffect(() => {
    if (isDataLoaded && data) {
      reset({
        email: data.user.email,
        name: data.user.name,
        city: data.user.city,
        breakInterval: data.user.breakInterval,
        intervalsCount: data.user.intervalsCount,
        workInterval: data.user.workInterval,
      });
      setIsLoading(false);
    }
  }, [isDataLoaded, data]);
}
