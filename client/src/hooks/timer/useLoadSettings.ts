import { useFetchUserProfile } from "@/hooks/user/useFetchUserProfile";
import { useEffect, useState } from "react";

export function useLoadSettings() {
	const [workInterval, setWorkInterval] = useState<number>(50);
	const [breakInterval, setBreakInterval] = useState<number>(10);
	const { profileData, isDataLoaded } = useFetchUserProfile();
	const user = profileData?.user; // `user` буде або значенням, або undefined

	useEffect(() => {
		if (isDataLoaded && user) {
			setWorkInterval(user.workInterval ? user.workInterval : 50);
			setBreakInterval(user.breakInterval ? user.breakInterval : 10);
		}
	}, [isDataLoaded, user]);

	return { workInterval, breakInterval, isDataLoaded };
}
