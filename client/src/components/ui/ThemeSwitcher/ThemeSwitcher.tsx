"use client";

import {
  createElement,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";

import { Moon, Sun } from "@phosphor-icons/react/dist/ssr"; // Icon components for sun and moon
import styles from "./ThemeSwitcher.module.scss"; // Scoped CSS module styles

// Define the theme type as either 'light' or 'dark'
type Theme = "light" | "dark";

/**
 * ThemeSwitcher component toggles between light and dark themes.
 *
 * It reads the saved theme from localStorage on client mount,
 * applies it to the root html element,
 * and allows toggling the theme on click, updating localStorage and DOM accordingly.
 *
 * @param {PropsWithChildren<unknown>} props - The component props, currently accepts children but does not render them.
 * @returns {JSX.Element | null} Theme switcher UI with sun and moon icons; renders null during initial hydration.
 */
export default function ThemeSwitcher({
  children,
}: PropsWithChildren<unknown>) {
  // State to keep track of current theme, start with null to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // On client only, read saved theme from localStorage or default to 'light'
    const savedTheme =
      (typeof window !== "undefined" &&
        (localStorage.getItem("theme") as Theme)) ||
      "light";
    setTheme(savedTheme);
    // Apply the theme class to the root html element
    document.documentElement.className = savedTheme;
  }, []);

  // While theme is null (not loaded yet), render nothing to prevent hydration errors
  if (theme === null) {
    return null;
  }

  return (
    <div
      className={styles["theme-switcher"]}
      onClick={() =>
        setTheme((prevTheme) => {
          // Toggle theme between light and dark
          const newTheme = prevTheme === "light" ? "dark" : "light";
          // Save new theme in localStorage for persistence
          localStorage.setItem("theme", newTheme);
          // Update the root html element's className to apply new theme styles
          document.documentElement.className = newTheme;
          return newTheme;
        })
      }
    >
      {/* Sun icon container, styles differ based on current theme */}
      <div
        className={`${styles["theme-switcher__light-mode"]} ${
          theme === "dark" && styles["theme-switcher__light-mode__dark"]
        }`}
      >
        {createElement(Sun, { size: "20" })}
      </div>

      {/* Moon icon container, styles differ based on current theme */}
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
