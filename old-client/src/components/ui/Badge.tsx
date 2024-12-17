import { BadgeVariants } from "@/constants/badge.constants";
import type { CSSProperties, PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

interface BadgeProps {
	className?: string;
	variant?: BadgeVariants[keyof BadgeVariants];
	style?: CSSProperties;
}

const badge = tv({
	base: "block rounded-lg w-max py-1 px-2 text-xs font-medium text-sm text-white transition",
	variants: {
		backgroundColor: {
			default: BadgeVariants.DEFAULT,
			high: BadgeVariants.HIGH,
			medium: BadgeVariants.MEDIUM,
			low: BadgeVariants.LOW,
		},
	},
	defaultVariants: {
		backgroundColor: "default",
	},
});

export function Badge({
	children,
	className,
	variant = 'default', // Використання enum
	style,
}: PropsWithChildren<BadgeProps>) {
	return (
		<span
			role="status"
			aria-label={typeof children === "string" ? children : undefined}
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
