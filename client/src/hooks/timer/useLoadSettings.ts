import { useFetchUserProfile } from "@/hooks/useFetchUserProfile";

export function useLoadSettings() {
	const { profileData } = useFetchUserProfile();
	const user = profileData?.user; // `user` буде або значенням, або undefined

	const workInterval = user?.workInterval ?? 50;
	const breakInterval = user?.workInterval ?? 10;

	return { workInterval, breakInterval };
}
