import {
	CheckmarkCircle02Icon,
	DashboardSquare01Icon,
	HourglassIcon,
	Logout01Icon,
	Timer02Icon,
	UserMultiple02Icon,
} from "hugeicons-react";
import Link from "next/link";
import { createElement, type PropsWithChildren } from "react";

export default function Sidebar({ children }: PropsWithChildren<unknown>) {
	const menus = [
		{ name: "Dashboard", link: "/", icon: DashboardSquare01Icon },
		{ name: "Tasks", link: "/", icon: CheckmarkCircle02Icon },
		{ name: "Time Blocking", link: "/", icon: HourglassIcon },
		{ name: "Pomodoro Timer", link: "/", icon: Timer02Icon },
		{ name: "User Settings", link: "/", icon: UserMultiple02Icon },
		// { name: "Messages", link: "/", icon: Chatting01Icon },
	];

	return (
		<div className="relative flex flex-col flex-wrap md:justify-between bg-blockColor border-r border-borderColor p-6 flex-none w-64 shadow-xl gap-y-3">
			<div className="menu flex flex-col flex-wrap gap-y-3">
				{menus?.map((menu, i) => (
					<Link
						href={menu?.link}
						key={i}
						className={` 
              group flex items-center text-sm gap-3.5 font-medium p-2 border border-borderColor h-auto hover:bg-foreground hover:text-background transition-all ease-in-out duration-200`}
					>
						<div className="text-borderColor group-hover:text-background transition-all ease-in-out duration-200">
							{createElement(menu?.icon, { size: "20" })}
						</div>
						<h2 className={`whitespace-pre`}>{menu?.name}</h2>
					</Link>
				))}
			</div>
			<div className="options sticky bottom-6">
				<Link
					href={"#"}
					className={` 
              group flex items-center text-sm gap-3.5 font-medium p-2 border border-borderColor h-auto hover:bg-foreground hover:text-background transition-all ease-in-out duration-200`}
				>
					<div className="text-borderColor group-hover:text-background transition-all ease-in-out duration-200">
						{createElement(Logout01Icon, { size: "20" })}
					</div>
					<h2 className={`whitespace-pre`}>Log out</h2>
				</Link>
			</div>
		</div>
	);
}
