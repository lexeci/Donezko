import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				outerColor: "var(--outer__color)",
				blockColor: "var(--block__color)",
				borderColor: "var(--border__color)",
				definerColor: "var(--definer__color)",
			},
		},
	},
	plugins: [],
};
export default config;
