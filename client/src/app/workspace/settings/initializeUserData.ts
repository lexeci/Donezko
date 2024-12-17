import { useEffect } from "react";
import { UseFormReset } from "react-hook-form";

import { UserFormType } from "@/types/auth.types"; // Зміна назви типу для унікальності

import { useFetchUserProfile } from "@/hooks/useFetchUserProfile"; // Зміна назви хуку

// Перейменування функції для підвищення унікальності
export function initializeUserData(resetForm: UseFormReset<UserFormType>) {
	const { profileData, isDataLoaded } = useFetchUserProfile(); // Зміна змінних для унікальності
	const user = profileData?.user; // `user` буде або значенням, або undefined

	useEffect(() => {
		if (isDataLoaded && user) {
			resetForm({
				email: user.email,
				name: user.name,
				breakInterval: user.breakInterval,
				intervalsCount: user.intervalsCount,
				workInterval: user.workInterval,
			});
		}
	}, [isDataLoaded, user, resetForm]); // Додано profileData та resetForm у залежності
}
