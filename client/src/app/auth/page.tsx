"use client";

import {
  Authorization,
  NoConnection,
  WindowContainer,
} from "@/components/index";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

import styles from "@/app/page.module.scss";
import clsx from "clsx";

/**
 * AuthPage component displays the authorization UI if online,
 * or a no connection message if offline.
 *
 * @returns {JSX.Element} The rendered authorization page or offline notice.
 */
export default function AuthPage() {
  const isOnline = useNetworkStatus();

  return isOnline ? (
    <div className={clsx(styles.authorization, "bg-radial-grid")}>
      <div>
        <WindowContainer
          title={"TPlanner Authorization"}
          subtitle={"Login.exe"}
          fullPage
        >
          <Authorization />
        </WindowContainer>
      </div>
    </div>
  ) : (
    <NoConnection />
  );
}
