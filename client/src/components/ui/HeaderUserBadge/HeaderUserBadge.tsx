"use client";

import { Button } from "@/components/index";
import { useCookieMonitor } from "@/src/hooks/useCookieMonitor";
import { useFetchUserProfile } from "@/src/hooks/useFetchUserProfile";

export default function HeaderUserBadge() {
	const { profileData, isDataLoading, refetch } = useFetchUserProfile();
	const user = profileData?.user; // `user` буде або значенням, або undefined

	// Використовуємо моніторинг для REFRESH_TOKEN
	useCookieMonitor("accessToken", () => {
		refetch(); // Повторно виконуємо запит, якщо токен з'явився
	});

	return (
		<div>
			{isDataLoading || !user ? (
				<Button type="link" link="/auth">
					Login
				</Button>
			) : (
				<p>Welcome,{user.name}</p>
			)}
		</div>
	);
}
