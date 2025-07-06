"use client";

import {
  Button,
  DigitalClock,
  HeaderUserBadge,
  Logo,
  ThemeSwitcher,
} from "@/components/index";
import { useCookieMonitor } from "@/hooks/useCookieMonitor";
import { useFetchUserProfile } from "@/hooks/user/useFetchUserProfile";
import { AuthUser } from "@/types/auth.types";
import generateKeyComp from "@/utils/generateKeyComp";
import { useEffect, useState } from "react";
import { SelectOrganization } from "../../ui";
import styles from "./Header.module.scss";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";

/**
 * Header component displays the main site header including logo,
 * navigation links, theme switcher, user badge, clock, and organization selector.
 * It conditionally renders links and options based on user authentication and cookies.
 *
 * @returns {JSX.Element} The header element
 */
export default function Header() {
  const [user, setUser] = useState<AuthUser | undefined>();
  const { profileData, isDataLoading } = useFetchUserProfile();
  const [cookiesExist, setCookiesExist] = useState(false);

  // Callback when cookie appears
  const handleCookieChange = () => {
    setCookiesExist(true);
  };

  // Callback when cookie disappears
  const handleCookieRemove = () => {
    setCookiesExist(false);
  };

  // Monitor "accessToken" cookie for changes
  useCookieMonitor("accessToken", handleCookieChange, handleCookieRemove);

  // Update user state when profile data and cookie exist
  useEffect(() => {
    if (profileData && cookiesExist) {
      setUser(profileData.user);
    }
  }, [profileData, isDataLoading, cookiesExist]);

  // Navigation links: add Dashboard if user is authenticated and cookie exists
  const navigation = [
    { link: "/", title: "Homepage" },
    { link: "/about", title: "about us" },
    ...(user && cookiesExist
      ? [{ link: DASHBOARD_PAGES.HOME, title: "Dashboard" }]
      : []),
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo />

        <ul className={styles.links}>
          {navigation.map((item, i) => (
            <li key={generateKeyComp(`${item.title}_${i}`)}>
              <Button type="link" link={item.link} negative block>
                {item.title}
              </Button>
            </li>
          ))}
        </ul>

        <div className={styles.options}>
          <ThemeSwitcher aria-label="Toggle theme" />
          {profileData && cookiesExist && (
            <SelectOrganization aria-label="Select workspace organization" />
          )}
          <DigitalClock aria-label="Current time" />
          <HeaderUserBadge aria-label="User options" />
        </div>
      </div>
    </header>
  );
}
