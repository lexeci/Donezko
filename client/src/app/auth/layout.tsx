export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative overflow-hidden h-[calc(100vh-82px)] w-full flex flex-row justify-center items-center bg-radial-grid">
			{children}
		</div>
	);
}
