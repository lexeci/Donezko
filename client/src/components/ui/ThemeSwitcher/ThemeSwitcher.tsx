"use client";

import {
	createElement,
	useEffect,
	useState,
	type PropsWithChildren,
} from "react";

import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import styles from "./ThemeSwitcher.module.scss";

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
			className={styles["theme-switcher"]}
			onClick={() =>
				setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"))
			}
		>
			<div
				className={`${styles["theme-switcher__light-mode"]} ${
					theme === "dark" && styles["theme-switcher__light-mode__dark"]
				}`}
			>
				{createElement(Sun, { size: "20" })}
			</div>
			<div
				className={`${styles["theme-switcher__dark-mode"]} ${
					theme === "light" && styles["theme-switcher__dark-mode__light"]
				}`}
			>
				{createElement(Moon, { size: "20" })}
			</div>
		</div>
	);
}
