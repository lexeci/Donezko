"use client";

import { createElement, useState, type PropsWithChildren } from "react";
import { Moon01Icon, Sun03Icon } from "hugeicons-react";

export default function ThemeSwitcher({
	children,
}: PropsWithChildren<unknown>) {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	return (
		<div
			className="switch-theme cursor-pointer relative h-5 w-5"
			onClick={() => setTheme(theme == "light" ? "dark" : "light")}
		>
			<div
				className={`day absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-in-out duration-200 ${
					theme == "dark" ? "opacity-0 invisible" : "opacity-1 visible"
				}`}
			>
				{createElement(Sun03Icon, { size: "20" })}
			</div>
			<div
				className={`night absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-in-out duration-200 ${
					theme == "light" ? "opacity-0 invisible" : "opacity-1 visible"
				} `}
			>
				{createElement(Moon01Icon, { size: "20" })}
			</div>
		</div>
	);
}
