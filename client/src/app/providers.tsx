"use client";

import { OrganizationProvider } from "@/context/OrganizationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";

export function Providers({ children }: PropsWithChildren) {
	const [client] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false,
				},
			},
		})
	);

	return (
		<QueryClientProvider client={client}>
			<OrganizationProvider>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
			</OrganizationProvider>
		</QueryClientProvider>
	);
}
