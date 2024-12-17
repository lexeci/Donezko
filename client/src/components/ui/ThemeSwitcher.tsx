"use client";

import {
	createElement,
	useEffect,
	useState,
	type PropsWithChildren,
} from "react";
import { Moon01Icon, Sun03Icon } from "hugeicons-react";

type Theme = "light" | "dark";

export default function ThemeSwitcher({
	children,
}: PropsWithChildren<unknown>) {
	const [theme, setTheme] = useState<Theme>(() => {
		// Retrieve theme from localStorage or default to light
		return (
			(typeof window !== "undefined" &&
				(localStorage.getItem("theme") as Theme)) ||
			"light"
		);
	});

	// Update localStorage and document class whenever the theme changes
	useEffect(() => {
		localStorage.setItem("theme", theme);
		document.documentElement.className = theme; // Set class on the root element
	}, [theme]);

	return (
		<div
			className="switch-theme cursor-pointer relative h-5 w-5"
			onClick={() =>
				setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"))
			}
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			<div
				className={`day absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-in-out duration-200 ${
					theme === "dark" ? "opacity-0 invisible" : "opacity-1 visible"
				}`}
			>
				{createElement(Sun03Icon, { size: "20" })}
			</div>
			<div
				className={`night absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-in-out duration-200 ${
					theme === "light" ? "opacity-0 invisible" : "opacity-1 visible"
				}`}
			>
				{createElement(Moon01Icon, { size: "20" })}
			</div>
		</div>
	);
}
