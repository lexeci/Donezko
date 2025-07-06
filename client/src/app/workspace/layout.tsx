"use client";

import { NoConnection, NoOrganization, Sidebar } from "@/components/index";
import { useOrganization } from "@/context/OrganizationContext";
import { CoinVertical } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

import styles from "./layout.module.scss";
import pageStyles from "@/app/page.module.scss";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";

/**
 * Layout component wraps the main application structure.
 * Displays sidebar, handles online/offline status, loading states, and organization selection.
 *
 * @param {Readonly<{ children: React.ReactNode }>} props - Component children
 * @returns {JSX.Element} - Rendered layout based on network and organization context
 */
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check current online status using custom hook
  const isOnline = useNetworkStatus();

  // Extract organizationId from global context
  const { organizationId } = useOrganization();

  // Local state to track whether organizationId is still loading
  const [isLoading, setIsLoading] = useState(true);

  // Update loading state once organizationId is defined (null or actual ID)
  useEffect(() => {
    if (organizationId !== undefined) {
      setIsLoading(false);
    }
  }, [organizationId]);

  // Determine if a valid organization is selected (not null)
  const isSelected = organizationId !== null;

  // Get current pathname from router
  const pathname = usePathname();

  // If user is online
  return isOnline ? (
    <div className={pageStyles["workspace-base"]}>
      {/* Sidebar navigation */}
      <Sidebar />

      <div className={pageStyles["content-base"]}>
        {/* Show loading spinner while waiting for organizationId */}
        {isLoading ? (
          <div className={pageStyles["workspace-not-loaded-coin"]}>
            <CoinVertical size={80} />
          </div>
        ) : isSelected || pathname === DASHBOARD_PAGES.ORGANIZATIONS ? (
          // Show content if organization is selected or user is on the organization page
          <div className={styles["selected-content"]}>{children}</div>
        ) : (
          // Show organization selection prompt if none is selected
          <NoOrganization />
        )}
      </div>
    </div>
  ) : (
    // If user is offline, display connection error component
    <NoConnection />
  );
}
