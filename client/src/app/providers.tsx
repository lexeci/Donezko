"use client";

import { OrganizationProvider } from "@/context/OrganizationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";

/**
 * Providers component wraps the application with required context providers,
 * including React Query and custom Organization context.
 *
 * @param {PropsWithChildren} props - Props containing child components
 * @returns {JSX.Element} - The wrapped application with providers
 */
export function Providers({ children }: PropsWithChildren) {
  // Initialize a single instance of QueryClient using useState
  // to persist it across re-renders
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false, // Disable automatic refetch on window focus
        },
      },
    })
  );

  return (
    // Provide the QueryClient to the React Query context
    <QueryClientProvider client={client}>
      {/* Provide the custom Organization context to the application */}
      <OrganizationProvider>
        {/* Render all child components passed to the Providers */}
        {children}

        {/* Render the React Query Devtools panel (initially closed) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </OrganizationProvider>
    </QueryClientProvider>
  );
}
