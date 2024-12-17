import { UserIcon } from "hugeicons-react";

import { useFetchUserProfile } from "@/hooks/useFetchUserProfile";

export default function HeaderUserBadge() {
	const { profileData, isDataLoading } = useFetchUserProfile();
	const user = profileData?.user; // `user` буде або значенням, або undefined

	return (
		<div
			className="user-badge flex flex-row justify-center items-center gap-x-3 border-l border-l-definerColor pl-6"
			aria-label="User Badge"
		>
			{isDataLoading && <p>Loading</p>}
			<div className="info flex flex-col justify-end text-right leading-none">
				{user && (
					<>
						<p className="username font-light text-sm">{user.name}</p>
						<p className="email font-light text-sm text-foreground">
							{user.email}
						</p>
					</>
				)}
			</div>
			<div
				className="logo h-8 w-8 border-borderColor border rounded-full text-foreground flex justify-center items-center"
				aria-label="User icon"
			>
				<UserIcon size="18" />
			</div>
		</div>
	);
}
