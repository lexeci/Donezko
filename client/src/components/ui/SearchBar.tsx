"use client";

import { Search02Icon } from "hugeicons-react";
import { createElement, useState, type PropsWithChildren } from "react";

export default function SearchBar({ children }: PropsWithChildren<unknown>) {
	const [search, setSearch] = useState<string>();

	const handleInputChange = (e: any) => {
		setSearch(e.target.value as unknown as string);
	};

	return (
		<div className="flex px-6 py-3 border border-borderColor overflow-hidden w-full max-w-md mx-auto font-[sans-serif]">
			<input
				value={search}
				onChange={handleInputChange}
				type="email"
				placeholder="Search Something ..."
				className="w-full outline-none bg-transparent text-foreground text-sm"
			/>
			<div className="search-ico ml-6 cursor-pointer">
				{createElement(Search02Icon, { size: "18" })}
			</div>
		</div>
	);
}
