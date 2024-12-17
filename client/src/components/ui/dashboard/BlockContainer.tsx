import { PropsWithChildren } from "react";

export default function BlockContainer({ children }: PropsWithChildren) {
	return (
		<div className="block-container group flex flex-col items-center gap-3.5 p-3 border border-borderColor h-auto w-auto">
			{children}
		</div>
	);
}
