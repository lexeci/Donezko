"use client";

import {Button} from "@/components/index";
import {useCookieMonitor} from "@/hooks/useCookieMonitor";
import {useFetchUserProfile} from "@/hooks/user/useFetchUserProfile";
import {useEffect, useState} from "react";

export default function HeaderUserBadge() {
    const {profileData, isDataLoading} = useFetchUserProfile();
    const [user, setUser] = useState(profileData?.user); // Динамічно зберігаємо користувача

    const [cookiesExist, setCookiesExist] = useState(false);

    // Колбек, коли кука з'являється
    const handleCookieChange = () => {
        setCookiesExist(true);
    };

    // Колбек, коли кука зникає
    const handleCookieRemove = () => {
        setCookiesExist(false);
    };

    // Викликаємо useCookieMonitor з двома колбеками
    useCookieMonitor("accessToken", handleCookieChange, handleCookieRemove);

    useEffect(() => {
        if (profileData && cookiesExist) {
            setUser(profileData?.user);
        }
    }, [profileData, isDataLoading, cookiesExist]);

    return (
        <div>
            {isDataLoading || !user || !cookiesExist ? (
                <Button type="link" link="/auth">
                    Login
                </Button>
            ) : (
                <p>Welcome, {user.name}</p>
            )}
        </div>
    );
}
