import { UserIcon } from "hugeicons-react";
import { createElement, type PropsWithChildren } from "react";

export default function HeaderUserBadge({
	children,
}: PropsWithChildren<unknown>) {
	return (
		<div className="user-badge flex flex-row justify-center items-center gap-x-3 border-l border-l-definerColor pl-6">
			<div className="info flex flex-col justify-end text-right leading-none">
				<p className="username font-light text-sm">Andriy Neaijko</p>
				<p className="email font-light text-sm text-foreground">
					andriy.neaijko@gmail.com
				</p>
			</div>
			<div className="logo h-8 w-8 border-borderColor border rounded-full text-foreground flex justify-center items-center">
				{createElement(UserIcon, { size: "18" })}
			</div>
		</div>
	);
}
