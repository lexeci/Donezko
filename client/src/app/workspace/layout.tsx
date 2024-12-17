import Sidebar from "@/components/elements/sidebar/Sidebar";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-row items-stretch justify-between w-full">
			<Sidebar />
			<div
				className="content-base flex-1 p-6"
				style={{ width: "calc(100% - 16rem)" }}
			>
				{children}
			</div>
		</div>
	);
}
