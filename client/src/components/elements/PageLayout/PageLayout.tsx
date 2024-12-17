import { PropsWithChildren } from "react";

export default function PageLayout({ children }: PropsWithChildren) {
	return (
		<div className="page w-full flex flex-col justify-center items-center">
			{children}
		</div>
	);
}
