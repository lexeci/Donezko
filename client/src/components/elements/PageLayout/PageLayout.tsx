import { PropsWithChildren } from "react";

export default function PageLayout({ children }: PropsWithChildren) {
	return (
		<div className="page w-full h-full flex flex-col justify-start items-center">
			{children}
		</div>
	);
}
