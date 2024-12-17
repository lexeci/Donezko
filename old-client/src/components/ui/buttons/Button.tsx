import cn from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean; // Added loading state
};

export function Button({
	children,
	className,
	loading = false, // Default loading to false
	disabled = false, // Default disabled to false
	...rest
}: PropsWithChildren<TypeButton>) {
	return (
		<button
			className={cn(
				"flex justify-center items-center text-sm text-foreground gap-3.5 w-full text-center font-medium p-2 border border-borderColor h-auto transition-all ease-in-out duration-200", // Removed hover effects for disabled state
				{
					"hover:bg-foreground hover:text-background": !loading && !disabled, // Only apply hover effects when not loading or disabled
					"bg-gray-300 cursor-not-allowed": disabled, // Styles for disabled state
				},
				className
			)}
			disabled={disabled || loading} // Disable button if loading or disabled
			{...rest}
		>
			{loading ? (
				<span>Loading...</span> // Loading indicator
			) : (
				children
			)}
		</button>
	);
}
