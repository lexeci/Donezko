import { useFetchUserProfile } from "@/hooks/user/useFetchUserProfile";
import { useEffect, useState } from "react";

/**
 * Custom React hook for loading user-specific timer settings (work and break intervals).
 *
 * This hook fetches the user's profile and extracts the `workInterval` and `breakInterval` settings.
 * If the values are unavailable, it falls back to default values (50 for work, 10 for break).
 *
 * @returns {{
 *   workInterval: number,
 *   breakInterval: number,
 *   isDataLoaded: boolean
 * }} - Returns the user's work interval, break interval, and a flag indicating if the data has been loaded.
 *
 * @example
 * const { workInterval, breakInterval, isDataLoaded } = useLoadSettings();
 *
 * if (isDataLoaded) {
 *   console.log(`Work: ${workInterval} min, Break: ${breakInterval} min`);
 * }
 */
export function useLoadSettings() {
  const [workInterval, setWorkInterval] = useState<number>(50);
  const [breakInterval, setBreakInterval] = useState<number>(10);
  const { profileData, isDataLoaded } = useFetchUserProfile();
  const user = profileData?.user;

  useEffect(() => {
    if (isDataLoaded && user) {
      setWorkInterval(user.workInterval ? user.workInterval : 50);
      setBreakInterval(user.breakInterval ? user.breakInterval : 10);
    }
  }, [isDataLoaded, user]);

  return { workInterval, breakInterval, isDataLoaded };
}
