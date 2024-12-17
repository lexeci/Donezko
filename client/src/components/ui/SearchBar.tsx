"use client";

import { Search02Icon } from "hugeicons-react";
import { createElement, useState, type PropsWithChildren } from "react";

export default function SearchBar({ children }: PropsWithChildren<unknown>) {
	const [search, setSearch] = useState<string>(""); // Initialize with an empty string

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value); // Use the specific type for event
	};

	return (
		<div className="flex px-6 py-3 border border-borderColor overflow-hidden w-full max-w-md mx-auto font-sans">
			<input
				value={search}
				onChange={handleInputChange}
				type="text" // Change type to text
				placeholder="Search Something ..."
				aria-label="Search" // Add aria-label for accessibility
				className="w-full outline-none bg-transparent text-foreground text-sm"
			/>
			<button type="button" className="search-ico ml-2 cursor-pointer">
				{createElement(Search02Icon, { size: "18" })}
			</button>
		</div>
	);
}
