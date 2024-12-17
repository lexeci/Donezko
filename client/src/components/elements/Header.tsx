'use client';

// TODO: Switch from client to ssr

import { type PropsWithChildren } from "react";
import DigitalClock from "@/components/ui/DigitalClock";
import HeaderUserBadge from "@/components/ui/HeaderUserBadge";
import SearchBar from "@/components/ui/SearchBar";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

export default function Header({ children }: PropsWithChildren<unknown>) {
	return (
		<div className="md:fixed md:w-full md:top-0 md:z-20 flex flex-row flex-wrap items-center justify-between bg-blockColor px-6 border-b border-borderColor h-[82px]">
			<div
				className="logo flex-none w-56 flex flex-col items-start cursor-pointer"
				aria-label="TPlanner Logo"
			>
				<div className="flex flex-row items-center">
					<strong className="capitalize flex-1 font-mono text-2xl tracking-widest">
						TPlanner
					</strong>
				</div>
				<p className="uppercase text-xs">Be a manager for your day</p>
			</div>
			<SearchBar aria-label="Search tasks" />
			{/* Add aria-label for accessibility */}
			<div className="options flex flex-row justify-center items-center gap-x-6">
				<ThemeSwitcher aria-label="Toggle theme" />
				{/* Add aria-label for accessibility */}
				{/* <DigitalClock aria-label="Current time" /> */}
				{/* Add aria-label for accessibility */}
				<HeaderUserBadge aria-label="User options" />
				{/* Add aria-label for accessibility */}
			</div>
		</div>
	);
}
