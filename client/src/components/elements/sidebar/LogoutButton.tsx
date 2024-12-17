import { createElement } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Logout01Icon } from "hugeicons-react";

import { authService } from "@/services/auth.service";

export default function LogoutButton() {
	const router = useRouter();

	const { mutate } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess: () => router.push("/auth"),
	});

	return (
		<div
			className={`group flex items-center text-sm gap-3.5 font-medium p-2 border border-borderColor h-auto hover:bg-foreground hover:text-background transition-all ease-in-out duration-200 cursor-pointer`}
			onClick={() => mutate()}
		>
			<div className="text-borderColor group-hover:text-background transition-all ease-in-out duration-200">
				{createElement(Logout01Icon, { size: "20" })}
			</div>
			<h2 className={`whitespace-pre`}>Log out</h2>
		</div>
	);
}
