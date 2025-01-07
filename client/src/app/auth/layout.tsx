"use client";

import {useNetworkStatus} from "@/hooks/useNetworkStatus";
import {NoConnection} from "@/src/components";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    const isOnline = useNetworkStatus();

    return isOnline ? (
        <div
            className="relative overflow-hidden h-[calc(100vh-82px)] w-full flex flex-row justify-center items-center bg-radial-grid">
            {children}
        </div>
    ) : (
        <NoConnection/>
    );
}
