"use client";

import { Button } from "@/components/index";
import { useCookieMonitor } from "@/hooks/useCookieMonitor";
import { useFetchUserProfile } from "@/hooks/user/useFetchUserProfile";
import { useEffect, useState } from "react";

/**
 * HeaderUserBadge component displays the user's login status in the header.
 *
 * It monitors the presence of a specific cookie ("accessToken") to determine if the user
 * is authenticated and fetches the user profile data. Depending on this state,
 * it either shows a welcome message with the user's name or a login button.
 *
 * @component
 * @returns {JSX.Element} User greeting if logged in; otherwise, a login button.
 */
export default function HeaderUserBadge() {
  // Fetch user profile data and loading status
  const { profileData, isDataLoading } = useFetchUserProfile();

  // Local state to hold the current user info dynamically
  const [user, setUser] = useState(profileData?.user);

  // State tracking if the required cookie exists
  const [cookiesExist, setCookiesExist] = useState(false);

  // Callback when the cookie appears
  const handleCookieChange = () => {
    setCookiesExist(true);
  };

  // Callback when the cookie is removed
  const handleCookieRemove = () => {
    setCookiesExist(false);
  };

  // Hook to monitor the "accessToken" cookie with the above callbacks
  useCookieMonitor("accessToken", handleCookieChange, handleCookieRemove);

  // Update local user state when profile data or cookie presence changes
  useEffect(() => {
    if (profileData && cookiesExist) {
      setUser(profileData?.user);
    }
  }, [profileData, isDataLoading, cookiesExist]);

  return (
    <div>
      {/* Show login button if loading, no user, or cookie missing */}
      {isDataLoading || !user || !cookiesExist ? (
        <Button type="link" link="/auth">
          Login
        </Button>
      ) : (
        // Otherwise greet the user by name
        <p>Welcome, {user.name}</p>
      )}
    </div>
  );
}
