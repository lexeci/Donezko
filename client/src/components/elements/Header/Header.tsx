"use client";

import {
    Button,
    DigitalClock,
    HeaderUserBadge,
    Logo,
    ThemeSwitcher,
} from "@/components/index";
import {useCookieMonitor} from "@/hooks/useCookieMonitor";
import {useFetchUserProfile} from "@/hooks/user/useFetchUserProfile";
import {AuthUser} from "@/types/auth.types";
import generateKeyComp from "@/utils/generateKeyComp";
import {useEffect, useState} from "react";
import {SelectOrganization} from "../../ui";
import styles from "./Header.module.scss";
import { DASHBOARD_PAGES } from "@/src/pages-url.config";

export default function Header() {
    const [user, setUser] = useState<AuthUser | undefined>();
    const {profileData, isDataLoading} = useFetchUserProfile();
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

    const navigation = [
        {link: "/", title: "Homepage"},
        {link: "/about", title: "about us"},
        ...(user && cookiesExist
            ? [{link: DASHBOARD_PAGES.HOME, title: "Dashboard"}]
            : []), // Додаємо об'єкт лише якщо cookiesExist === true
    ];

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Logo/>
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
                    <ThemeSwitcher aria-label="Toggle theme"/>
                    {profileData && cookiesExist && (
                        <SelectOrganization aria-label="Select workspace organization"/>
                    )}
                    <DigitalClock aria-label="Current time"/>
                    <HeaderUserBadge aria-label="User options"/>
                </div>
            </div>
        </header>
    );
}
