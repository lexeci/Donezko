import cn from "clsx";
import { type InputHTMLAttributes, forwardRef } from "react";

type TransparentFieldProps = InputHTMLAttributes<HTMLInputElement>;

export const TransparentField = forwardRef<
	HTMLInputElement,
	TransparentFieldProps
>(({ className, placeholder = "Enter text...", ...rest }, ref) => {
	return (
		<input
			className={cn(
				"bg-transparent border-none focus:outline-none focus:shadow-none w-full appearance-none",
				className
			)}
			ref={ref}
			placeholder={placeholder}
			{...rest}
		/>
	);
});

TransparentField.displayName = "TransparentField";
