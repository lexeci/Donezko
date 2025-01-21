import Cookies from "js-cookie";
import {useEffect} from "react";

/**
 * Custom hook that monitors the presence of a specific cookie and triggers callbacks
 * when the cookie is added or removed.
 *
 * @param cookieName - The name of the cookie to monitor.
 * @param onChange - The callback to call when the cookie is found.
 * @param onRemove - The callback to call when the cookie is removed.
 */
export const useCookieMonitor = (
    cookieName: string,
    onChange: () => void,
    onRemove: () => void
) => {
    useEffect(() => {
        // Set an interval to check the presence of the cookie every second
        const interval = setInterval(() => {
            const cookieValue = Cookies.get(cookieName);

            if (cookieValue) {
                onChange(); // Trigger onChange callback if cookie exists
            } else {
                onRemove(); // Trigger onRemove callback if cookie does not exist
            }
        }, 1000); // Adjust the interval time as needed (currently set to 1 second)

        // Clean up interval on component unmount to avoid memory leaks
        return () => clearInterval(interval);
    }, [cookieName, onChange, onRemove]);
};
