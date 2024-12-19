"use client";

import { Sidebar } from "@/src/components";
import { useOrganization } from "@/src/context/OrganizationContext";
import { CoinVertical } from "@phosphor-icons/react";
import { SmileyMeh } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { organizationId } = useOrganization(); // Отримуємо organizationId з контексту
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (organizationId !== undefined) {
			setIsLoading(false);
		}
	}, [organizationId]);

	const isSelected = organizationId !== null;

	const pathname = usePathname();

	return (
		<div className="relative overflow-hidden max-h-[calc(100vh-82px)] w-full flex flex-row justify-between items-start">
			<Sidebar />
			<div
				className={clsx(
					"content-base max-h-[calc(100vh-82px)] h-[calc(100vh-82px)] overflow-auto"
				)}
				style={{ width: "calc(100% - 20rem)" }}
			>
				{isLoading ? (
					<div className="h-full flex justify-center items-center">
						<CoinVertical size={80} className="m-auto animate-spin" />
					</div>
				) : isSelected || pathname === "/workspace/organizations" ? (
					<div className="py-8 h-full">{children}</div>
				) : (
					<div className="h-full flex flex-col justify-center items-center gap-y-4 max-w-[40rem] mx-auto text-center">
						<SmileyMeh size={80} className="animate-spin" />
						<div className="title text-xl font-bold">
							<h3>You need to select an organization.</h3>
						</div>
						<div className="text-block">
							<p>
								Before you start you should choose an organization.
								<br />
								You can do it by choosing it from header or on the left sidebar
								<br />
								{
									"(Choose a organizations tab and click the available one for you)"
								}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
