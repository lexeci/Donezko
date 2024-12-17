import { type PropsWithChildren } from "react";
import DigitalClock from "../ui/DigitalClock";
import HeaderUserBadge from "../ui/HeaderUserBadge";
import SearchBar from "../ui/SearchBar";
import ThemeSwitcher from "../ui/ThemeSwitcher";

export default function Header({ children }: PropsWithChildren<unknown>) {
	return (
		<div className="md:fixed md:w-full md:top-0 md:z-20 flex flex-row flex-wrap items-center justify-between bg-blockColor px-6 border-b border-borderColor h-[82px]">
			<div className="logo flex-none w-56 flex flex-col items-start cursor-pointer">
				<div className="flex flex-row items-center">
					<strong className="capitalize flex-1 font-black text-2xl tracking-widest">
						TPlanner
					</strong>
				</div>
				<p className="uppercase text-xs">Be a manager for your day</p>
			</div>
			<SearchBar />
			<div className="options flex flex-row justify-center items-center gap-x-6">
				<ThemeSwitcher />
				<DigitalClock />
				<HeaderUserBadge />
			</div>
		</div>
	);
}
