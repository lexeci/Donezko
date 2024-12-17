import { PropsWithChildren } from "react";

interface BlockContainerProps extends PropsWithChildren {
	extraClassName?: string; // Allow for additional styling
}

export default function BlockContainer({
	children,
	extraClassName = "", // Default to an empty string
}: BlockContainerProps) {
	return (
		<div
			className={`block-container group flex flex-col items-center gap-3.5 p-3 border border-borderColor h-auto w-auto ${extraClassName}`}
		>
			{children}
		</div>
	);
}
