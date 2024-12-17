import { Sidebar } from "@/src/components";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative overflow-hidden max-h-[calc(100vh-82px)] w-full flex flex-row justify-between items-start">
			<Sidebar />
			<div
				className="content-base max-h-[calc(100vh-82px)] overflow-auto"
				style={{ width: "calc(100% - 20rem)" }}
			>
				<div className="py-8">{children}</div>
			</div>
		</div>
	);
}
