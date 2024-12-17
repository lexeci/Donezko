import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";

import Header from "@/components/elements/Header";
import Sidebar from "@/components/elements/Sidebar";
import Footer from "@/components/elements/Footer";

const inconsolata = Inconsolata({
	subsets: ["latin-ext"],
	variable: "--font-inconsolata",
	style: "normal",
});

export const metadata: Metadata = {
	title: "TPlanner * Make your day *",
	description: "Your best planner application to plan a plan everyday",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inconsolata.variable} antialiased`}>
				<Header />
				<div className="flex flex-row items-stretch justify-between pt-[82px]">
					<Sidebar />
					<div className="content-base flex-1 p-6">{children}</div>
				</div>
        <Footer />
			</body>
		</html>
	);
}
