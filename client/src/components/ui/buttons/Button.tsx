import cn from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
	children,
	className,
	...rest
}: PropsWithChildren<TypeButton>) {
	return (
		<button
			className={cn(
				"flex justify-center items-center text-sm text-foreground gap-3.5 w-full text-center font-medium p-2 border border-borderColor h-auto hover:bg-foreground hover:text-background transition-all ease-in-out duration-200",
				className
			)}
			{...rest}
		>
			{children}
		</button>
	);
}
