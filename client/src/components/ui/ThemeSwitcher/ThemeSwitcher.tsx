"use client";

import {createElement, type PropsWithChildren, useEffect, useState,} from "react";

import {Moon, Sun} from "@phosphor-icons/react/dist/ssr";
import styles from "./ThemeSwitcher.module.scss";

type Theme = "light" | "dark";

export default function ThemeSwitcher({
                                          children,
                                      }: PropsWithChildren<unknown>) {
    const [theme, setTheme] = useState<Theme | null>(null); // Start with null to handle hydration correctly

    useEffect(() => {
        // Retrieve the theme from localStorage only on the client-side
        const savedTheme = (typeof window !== "undefined" &&
            (localStorage.getItem("theme") as Theme)) || "light";
        setTheme(savedTheme);
        document.documentElement.className = savedTheme; // Set the class on the root element
    }, []);

    if (theme === null) {
        return null; // Prevent rendering until the theme is set (avoids hydration error)
    }

    return (
        <div
            className={styles["theme-switcher"]}
            onClick={() =>
                setTheme(prevTheme => {
                    const newTheme = prevTheme === "light" ? "dark" : "light";
                    localStorage.setItem("theme", newTheme); // Update localStorage
                    document.documentElement.className = newTheme; // Set the theme class on the root element
                    return newTheme;
                })
            }
        >
            <div
                className={`${styles["theme-switcher__light-mode"]} ${
                    theme === "dark" && styles["theme-switcher__light-mode__dark"]
                }`}
            >
                {createElement(Sun, {size: "20"})}
            </div>
            <div
                className={`${styles["theme-switcher__dark-mode"]} ${
                    theme === "light" && styles["theme-switcher__dark-mode__light"]
                }`}
            >
                {createElement(Moon, {size: "20"})}
            </div>
        </div>
    );
}
