import type { CSSProperties, PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

interface Badge {
	className?: string;
	variant?: string;
	style?: CSSProperties;
}

const badge = tv({
	base: "rounded-lg w-max py-1 px-2 text-xs font-medium text-sm text-white transition",
	variants: {
		backgroundColor: {
			foreground: "bg-foreground",
			high: "bg-red-400/60",
			medium: "bg-orange-400/70",
			low: "bg-blue-400/70",
		},
	},
	defaultVariants: {
		backgroundColor: "foreground",
	},
});

export function Badge({
	children,
	className,
	variant,
	style,
}: PropsWithChildren<Badge>) {
	return (
		<span
			className={badge({
				backgroundColor: variant as "low" | "high" | "medium",
				className,
			})}
			style={style}
		>
			{children}
		</span>
	);
}
